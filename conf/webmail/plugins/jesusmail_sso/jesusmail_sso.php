<?php

/**
 * JesusMail single-use login ticket integration for Roundcube 1.6.x.
 *
 * The browser only supplies an opaque 60-second ticket. This plugin exchanges it
 * server-to-server for credentials and passes them directly to Roundcube's
 * authenticate hook. Credentials are never rendered into HTML or redirected URLs.
 */
class jesusmail_sso extends rcube_plugin
{
    public $task = 'login';

    private const TICKET_PARAMETER = 'jesusmail_ticket';
    private const SECRET_HEADER = 'X-JesusMail-Roundcube-SSO-Secret';
    private const DEFAULT_CORE_URL = 'http://core/api/public/mailbox/login_ticket/consume';
    private const MAX_RESPONSE_BYTES = 8192;

    public function init()
    {
        $this->add_hook('startup', array($this, 'startup'));
        $this->add_hook('authenticate', array($this, 'authenticate'));
        $this->add_hook('login_after', array($this, 'login_after'));
    }

    public function startup($args)
    {
        if ($this->ticket() !== null) {
            $this->set_private_response_headers();
            $args['action'] = 'login';
        }

        return $args;
    }

    public function authenticate($args)
    {
        $ticket = $this->ticket();
        if ($ticket === null) {
            return $args;
        }

        $this->set_private_response_headers();
        $credential = $this->consume_ticket($ticket);
        if ($credential === null) {
            return $args;
        }

        $args['user'] = $credential['username'];
        $args['pass'] = $credential['password'];
        $args['cookiecheck'] = false;
        $args['valid'] = true;

        return $args;
    }

    public function login_after($args)
    {
        // Roundcube's normal successful-login redirect removes the ticket query string.
        $this->set_private_response_headers();
        return $args;
    }

    private function ticket()
    {
        $ticket = rcube_utils::get_input_string(
            self::TICKET_PARAMETER,
            rcube_utils::INPUT_GET,
            false,
            'ASCII'
        );

        if (!is_string($ticket) || !preg_match('/^[A-Za-z0-9_-]{43}$/D', $ticket)) {
            return null;
        }

        return $ticket;
    }

    private function consume_ticket($ticket)
    {
        $secret = $this->shared_secret();
        if ($secret === '') {
            return null;
        }

        $core_url = trim((string) rcmail::get_instance()->config->get('jesusmail_sso_core_url', self::DEFAULT_CORE_URL));
        if (!$this->valid_core_url($core_url)) {
            return null;
        }

        $payload = json_encode(array('ticket' => $ticket));
        if (!is_string($payload)) {
            return null;
        }

        $context = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header' => implode("\r\n", array(
                    'Content-Type: application/json',
                    'Accept: application/json',
                    self::SECRET_HEADER . ': ' . $secret,
                    'Connection: close',
                )),
                'content' => $payload,
                'timeout' => 3,
                'ignore_errors' => true,
                'follow_location' => 0,
                'max_redirects' => 0,
            ),
            'ssl' => array(
                'verify_peer' => true,
                'verify_peer_name' => true,
            ),
        ));

        // Suppress transport warnings to avoid accidental ticket/secret disclosure in logs.
        $handle = @fopen($core_url, 'rb', false, $context);
        if ($handle === false) {
            return null;
        }

        $metadata = stream_get_meta_data($handle);
        $response = stream_get_contents($handle, self::MAX_RESPONSE_BYTES + 1);
        fclose($handle);
        $headers = isset($metadata['wrapper_data']) && is_array($metadata['wrapper_data'])
            ? $metadata['wrapper_data']
            : array();

        if (!is_string($response)
            || strlen($response) > self::MAX_RESPONSE_BYTES
            || !$this->response_is_success($headers)
        ) {
            return null;
        }

        $decoded = json_decode($response, true);
        if (!is_array($decoded)
            || !isset($decoded['username'], $decoded['password'])
            || !is_string($decoded['username'])
            || !is_string($decoded['password'])
            || $decoded['password'] === ''
            || filter_var($decoded['username'], FILTER_VALIDATE_EMAIL) === false
        ) {
            return null;
        }

        return array(
            'username' => strtolower($decoded['username']),
            'password' => $decoded['password'],
        );
    }

    private function shared_secret()
    {
        $secret = getenv('JESUSMAIL_ROUNDCUBE_SSO_SECRET');
        if ($secret === false || trim($secret) === '') {
            $secret = getenv('JESSUSMAIL_ROUNDCUBE_SSO_SECRET');
        }

        return is_string($secret) ? trim($secret) : '';
    }

    private function valid_core_url($url)
    {
        $parts = parse_url($url);
        return is_array($parts)
            && isset($parts['scheme'], $parts['host'])
            && in_array(strtolower($parts['scheme']), array('http', 'https'), true)
            && !isset($parts['user'])
            && !isset($parts['pass']);
    }

    private function response_is_success($headers)
    {
        foreach (array_reverse($headers) as $header) {
            if (preg_match('/^HTTP\/\S+\s+(\d{3})\b/i', $header, $matches)) {
                return (int) $matches[1] === 200;
            }
        }

        return false;
    }

    private function set_private_response_headers()
    {
        header('Referrer-Policy: no-referrer');
        header('Cache-Control: no-store, private');
        header('Pragma: no-cache');
    }
}
