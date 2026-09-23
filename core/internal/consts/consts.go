package consts

import (
	"os"
	"strings"
)

// deploymentValue reads container naming overrides from the mounted .env file.
// New installations use the defaults; an existing stack can migrate services separately.
func deploymentValue(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	content, err := os.ReadFile(DEFAULT_DOCKER_ENV_FILE)
	if err != nil {
		return fallback
	}
	for _, line := range strings.Split(string(content), "\n") {
		name, value, ok := strings.Cut(strings.TrimSpace(line), "=")
		if ok && name == key && strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return fallback
}

const (
	DEFAULT_SERVER_NAME              = "jesus-mail"
	DEFAULT_DOCKER_ENV_FILE          = "../.env"
	PHP_FPM_SOCK_PATH                = "../php-sock/php-fpm.sock"
	ROUNDCUBE_ROOT_PATH              = "../webmail-data"
	ROUNDCUBE_ROOT_PATH_IN_CONTAINER = "/var/www/html"
	POSTGRESQL_SOCK                  = "../postgresql-socket"
	DEFAULT_DOCKER_CLIENT_CTX_KEY    = "dockerapi"
	JWT_BLACK_LIST_KEY_PREFIX        = "JWT_BLACK_LIST:"
	RSPAMD_LIB_PATH                  = "../rspamd-data"
	RSPAMD_LOCAL_D_PATH              = "../conf/rspamd/local.d"
	POSTFIX_MAIN_CONF                = "../conf/postfix/main.cf"
	POSTFIX_MASTER_CONF              = "../conf/postfix/master.cf"
	POSTFIX_CONF_PATH                = "../conf/postfix/conf"
	POSTFIX_MAILLOG_PATH             = "../logs/postfix"
	DOVECOT_CONF_D_PATH              = "../conf/dovecot/conf.d"
	SSL_PATH                         = "/etc/ssl/mail"
)

var (
	DEFAULT_NETWORK_NAME     = deploymentValue("JESUSMAIL_DEFAULT_NETWORK", "jesusmail-network")
	POSTFIX_HOSTNAME_ENV_KEY = deploymentValue("JESUSMAIL_POSTFIX_HOSTNAME_ENV", "JESUSMAIL_HOSTNAME")
	SERVICES                 = struct {
		Pgsql   string
		Redis   string
		Rspamd  string
		Dovecot string
		Postfix string
		Webmail string
		Core    string
	}{
		Pgsql:   deploymentValue("JESUSMAIL_SERVICE_PGSQL", "pgsql-jesusmail"),
		Redis:   deploymentValue("JESUSMAIL_SERVICE_REDIS", "redis-jesusmail"),
		Rspamd:  deploymentValue("JESUSMAIL_SERVICE_RSPAMD", "rspamd-jesusmail"),
		Dovecot: deploymentValue("JESUSMAIL_SERVICE_DOVECOT", "dovecot-jesusmail"),
		Postfix: deploymentValue("JESUSMAIL_SERVICE_POSTFIX", "postfix-jesusmail"),
		Webmail: deploymentValue("JESUSMAIL_SERVICE_WEBMAIL", "webmail-jesusmail"),
		Core:    deploymentValue("JESUSMAIL_SERVICE_CORE", "core-jesusmail"),
	}
)
