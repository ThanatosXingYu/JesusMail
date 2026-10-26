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
    // Roundcube loads task-scoped plugins only for that task. User activity spans
    // both login and mail tasks so the hooks must be available throughout a session.
    public $task = '';

    private const TICKET_PARAMETER = 'jesusmail_ticket';
    private const SECRET_HEADER = 'X-JesusMail-Roundcube-SSO-Secret';
    private const CLIENT_IP_HEADER = 'X-JesusMail-Client-IP';
    private const DEFAULT_CORE_URL = 'http://core/api/public/mailbox/login_ticket/consume';
    private const DEFAULT_DIAGNOSE_URL = 'http://core/api/public/mailbox/login_diagnose';
    private const DEFAULT_USER_EVENT_URL = 'http://core/api/public/mailbox/user_event';
    private const MAX_RESPONSE_BYTES = 8192;
    private const SESSION_USERNAME_KEY = 'jesusmail_sso_username';

    private $pendingUserEvents = array();
    private $userEventFlushRegistered = false;

    public function init()
    {
        $this->add_hook('startup', array($this, 'startup'));
        $this->add_hook('authenticate', array($this, 'authenticate'));
        $this->add_hook('login_after', array($this, 'login_after'));
        $this->add_hook('logout_after', array($this, 'logout'));
        $this->add_hook('loginform_content', array($this, 'login_form_content'));
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
            return $this->diagnose_login_credentials($args);
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

    public function login_form_content($args)
    {
        if (isset($args['inputs']['user'])) {
            $args['inputs']['user']['title'] = '<label for="rcmloginuser">邮箱</label>';
            $content = isset($args['inputs']['user']['content']) ? $args['inputs']['user']['content'] : '';
            if (is_string($content) && strpos($content, 'placeholder=') === false) {
                $updated = preg_replace(
                    '/id="rcmloginuser"/',
                    'id="rcmloginuser" placeholder="请输入邮箱地址"',
                    $content,
                    1
                );
                if (is_string($updated)) {
                    $args['inputs']['user']['content'] = $updated;
                }
            }
        }

        return $args;
    }

    public function login_after($args)
    {
        // Roundcube's normal successful-login redirect removes the ticket query string.
        $this->set_private_response_headers();
        $username = $this->event_username(isset($args['user']) ? $args['user'] : '');
        if ($username !== '') {
            $_SESSION[self::SESSION_USERNAME_KEY] = $username;
            $this->queue_user_event('login', $username);
        }
        return $args;
    }

    public function logout($args)
    {
        $username = $this->event_username(isset($args['user']) ? $args['user'] : '');
        if ($username !== '') {
            $this->queue_user_event('logout', $username);
        }
        return $args;
    }

    public function flush_user_events()
    {
        if (count($this->pendingUserEvents) === 0) {
            return;
        }

        // Finish the browser response before reporting activity. If this is not
        // PHP-FPM, discard best-effort events rather than delaying login/logout.
        if (!function_exists('fastcgi_finish_request')) {
            return;
        }
        fastcgi_finish_request();

        $secret = $this->shared_secret();
        if ($secret === '') {
            return;
        }
        $url = $this->user_event_url();
        if ($url === '') {
            return;
        }

        foreach ($this->pendingUserEvents as $event) {
            $this->post_core_json(
                $url,
                $event,
                $secret,
                array(self::CLIENT_IP_HEADER . ': ' . $this->client_ip())
            );
        }
        $this->pendingUserEvents = array();
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

        $decoded = $this->post_core_json($core_url, array('ticket' => $ticket), $secret);
        if (!is_array($decoded) || !isset($decoded['username'], $decoded['password'])) {
            return null;
        }

        if (!is_string($decoded['username'])
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

    private function queue_user_event($eventType, $username)
    {
        if (($eventType !== 'login' && $eventType !== 'logout') || $username === '') {
            return;
        }

        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? trim((string) $_SERVER['HTTP_USER_AGENT']) : '';
        if (strlen($userAgent) > 512) {
            $userAgent = substr($userAgent, 0, 512);
        }

        $this->pendingUserEvents[] = array(
            'username' => $username,
            'event_type' => $eventType,
            'user_agent' => $userAgent,
            'detail' => 'Roundcube webmail',
        );
        if (!$this->userEventFlushRegistered) {
            $this->userEventFlushRegistered = true;
            register_shutdown_function(array($this, 'flush_user_events'));
        }
    }

    private function event_username($candidate = '')
    {
        $candidates = array();
        if (is_string($candidate) && trim($candidate) !== '') {
            $candidates[] = $candidate;
        }

        $rcmail = rcmail::get_instance();
        if (isset($rcmail->user) && method_exists($rcmail->user, 'get_username')) {
            $candidates[] = $rcmail->user->get_username();
        }
        if (isset($_SESSION[self::SESSION_USERNAME_KEY])) {
            $candidates[] = $_SESSION[self::SESSION_USERNAME_KEY];
        }

        foreach ($candidates as $value) {
            if (!is_string($value)) {
                continue;
            }
            $username = strtolower(trim($value));
            if (filter_var($username, FILTER_VALIDATE_EMAIL) !== false && strlen($username) <= 320) {
                return $username;
            }
        }
        return '';
    }

    private function user_event_url()
    {
        $url = trim((string) rcmail::get_instance()->config->get(
            'jesusmail_sso_user_event_url',
            self::DEFAULT_USER_EVENT_URL
        ));
        return $this->valid_core_url($url) ? $url : '';
    }

    private function diagnose_login_credentials($args)
    {
        $user = isset($args['user']) && is_string($args['user']) ? trim($args['user']) : '';
        $password = isset($args['pass']) && is_string($args['pass']) ? $args['pass'] : '';

        if ($user === '') {
            $args['valid'] = false;
            $args['error'] = '请输入邮箱地址。';
            return $args;
        }
        if ($password === '') {
            $args['valid'] = false;
            $args['error'] = '请输入密码。';
            return $args;
        }

        $secret = $this->shared_secret();
        if ($secret === '') {
            return $args;
        }

        $core_url = trim((string) rcmail::get_instance()->config->get(
            'jesusmail_login_diagnose_url',
            self::DEFAULT_DIAGNOSE_URL
        ));
        if (!$this->valid_core_url($core_url)) {
            return $args;
        }

        $decoded = $this->post_core_json(
            $core_url,
            array('username' => $user, 'password' => $password),
            $secret,
            array(self::CLIENT_IP_HEADER . ': ' . $this->client_ip())
        );
        if (!is_array($decoded) || !isset($decoded['status']) || !is_string($decoded['status'])) {
            // Keep normal IMAP authentication working if diagnostics are temporarily unavailable.
            return $args;
        }

        $status = $decoded['status'];
        if ($status === 'ok') {
            return $args;
        }

        $messages = array(
            'invalid_email' => '请输入完整的邮箱地址，例如 name@example.com。',
            'not_found' => '该邮箱不存在，请检查邮箱地址或先完成激活。',
            'unavailable' => '该邮箱已停用或已过期，请联系管理员。',
            'wrong_password' => '密码错误，请重新输入。',
            'rate_limited' => '登录尝试次数过多，请 10 分钟后再试。',
        );
        if (!isset($messages[$status])) {
            return $args;
        }

        // Slow down account enumeration while the shared-secret endpoint applies per-IP limits.
        usleep(250000);
        $args['valid'] = false;
        $args['error'] = $messages[$status];

        return $args;
    }

    private function post_core_json($url, $payload, $secret, $extra_headers = array())
    {
        $encoded = json_encode($payload);
        if (!is_string($encoded)) {
            return null;
        }

        $headers = array_merge(array(
            'Content-Type: application/json',
            'Accept: application/json',
            self::SECRET_HEADER . ': ' . $secret,
            'Connection: close',
        ), $extra_headers);

        $context = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header' => implode("\r\n", $headers),
                'content' => $encoded,
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
        $handle = @fopen($url, 'rb', false, $context);
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
        return is_array($decoded) ? $decoded : null;
    }

    private function client_ip()
    {
        $candidates = array(
            isset($_SERVER['HTTP_X_REAL_IP']) ? $_SERVER['HTTP_X_REAL_IP'] : '',
            isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
        );

        foreach ($candidates as $candidate) {
            $candidate = trim((string) $candidate);
            if (filter_var($candidate, FILTER_VALIDATE_IP) !== false) {
                return $candidate;
            }
        }

        return 'unknown';
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
