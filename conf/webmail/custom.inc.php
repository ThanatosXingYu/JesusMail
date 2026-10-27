<?php
    # Product name
    $config['product_name'] = 'JesusMail';
    $config['language'] = 'zh_CN'; // Default webmail locale; users can change it in preferences.
    $config['timezone'] = 'Asia/Shanghai';
    $config['login_username_filter'] = 'email';
    $config['display_product_info'] = false;

    $config['mime_types'] = '/var/roundcube/config/mime.types';
       
    # Plugins
    $config['plugins'] = array('password','userinfo','newmail_notifier','emoticons','zipdownload','jesusmail_sso');

    # JesusMail Roundcube SSO (the shared secret is read directly from the container environment)
    $config['jesusmail_sso_core_url'] = getenv('JESUSMAIL_ROUNDCUBE_SSO_CORE_URL') ?: 'http://core/api/public/mailbox/login_ticket/consume';
    $diagnose_url = getenv('JESUSMAIL_ROUNDCUBE_LOGIN_DIAGNOSE_URL');
    if ($diagnose_url === false || trim($diagnose_url) === '') {
        $diagnose_url = preg_replace(
            '~/mailbox/login_ticket/consume$~',
            '/mailbox/login_diagnose',
            $config['jesusmail_sso_core_url']
        );
    }
    $config['jesusmail_login_diagnose_url'] = $diagnose_url ?: 'http://core/api/public/mailbox/login_diagnose';
    $user_event_url = getenv('JESUSMAIL_ROUNDCUBE_USER_EVENT_URL');
    if ($user_event_url === false || trim($user_event_url) === '') {
        $user_event_url = preg_replace(
            '~/mailbox/login_ticket/consume$~',
            '/mailbox/user_event',
            $config['jesusmail_sso_core_url']
        );
    }
    $config['jesusmail_sso_user_event_url'] = $user_event_url ?: 'http://core/api/public/mailbox/user_event';

    # Password
    $config['password_query'] = 'update mailbox set password = %P where username = %u';
    $config['password_algorithm'] = 'md5-crypt';


# Please create an extra file: extra.php. Used to persist overrides Configuration
