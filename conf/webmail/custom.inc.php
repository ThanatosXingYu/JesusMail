<?php
    # Product name
    $config['product_name'] = 'JesusMail';
    $config['display_product_info'] = false;

    $config['mime_types'] = '/var/roundcube/config/mime.types';
       
    # Plugins
    $config['plugins'] = array('password','userinfo','newmail_notifier','emoticons','zipdownload','jesusmail_sso');

    # JesusMail Roundcube SSO (the shared secret is read directly from the container environment)
    $config['jesusmail_sso_core_url'] = getenv('JESUSMAIL_ROUNDCUBE_SSO_CORE_URL') ?: 'http://core/api/public/mailbox/login_ticket/consume';

    # Password
    $config['password_query'] = 'update mailbox set password = %P where username = %u';
    $config['password_algorithm'] = 'md5-crypt';


# Please create an extra file: extra.php. Used to persist overrides Configuration
