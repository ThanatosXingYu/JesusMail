# Running JesusMail Behind a Reverse Proxy

JesusMail can run behind nginx, Caddy, Traefik, or another reverse proxy for TLS termination, custom domains, and integration with existing infrastructure.

## The `reverse_proxy_domain` setting

JesusMail stores the public reverse-proxy address in the `reverse_proxy_domain` option. Tracking URLs and other public links use this value instead of the internal container address.

Configure it in **Settings > General > Reverse Proxy Domain**. Include the scheme, for example `https://mail.example.com`. The application validates connectivity before saving the value.

## Required headers

| Header | Purpose |
|---|---|
| `Host` | Preserves the public host used for URL generation |
| `X-Real-IP` | Supplies the client IP for analytics and rate limiting |
| `X-Forwarded-For` | Preserves the proxy chain for logging |
| `X-Forwarded-Proto` | Ensures public links use the correct scheme |

## nginx

```nginx
server {
    listen 443 ssl http2;
    server_name mail.example.com;

    ssl_certificate     /etc/ssl/certs/mail.example.com.pem;
    ssl_certificate_key /etc/ssl/private/mail.example.com.key;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:8080;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Let the JesusMail application handle SPA routes.
        proxy_intercept_errors off;
    }
}

server {
    listen 80;
    server_name mail.example.com;
    return 301 https://$host$request_uri;
}
```

## Caddy

```caddyfile
mail.example.com {
    reverse_proxy 127.0.0.1:8080 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-Proto {scheme}
    }
}
```

Caddy can manage certificates automatically when the public DNS and network requirements are satisfied.

## Traefik Docker labels

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.jesusmail.rule=Host(`mail.example.com`)"
  - "traefik.http.routers.jesusmail.tls.certresolver=letsencrypt"
  - "traefik.http.services.jesusmail.loadbalancer.server.port=8080"
```

## After setup

1. Open **Settings > General > Reverse Proxy Domain**.
2. Enter the full public URL, including `https://`.
3. Save only after the connectivity check succeeds.
4. Verify administrator pages, public activation, Roundcube, tracking URLs, and WebSocket updates.

## Troubleshooting

### SPA returns 404 after refresh

All frontend routes must reach the JesusMail backend. Do not configure a local `try_files` fallback that returns a static 404 before the request reaches the application.

### Tracking URLs contain an internal port

Confirm that `reverse_proxy_domain` is set and that `Host` and `X-Forwarded-Proto` are forwarded correctly.

### TLS certificate mismatch

The certificate must cover the same hostname configured as the reverse-proxy domain. Verify `server_name`, certificate files, and DNS.

### WebSocket updates fail

For nginx, forward the `Upgrade` and `Connection` headers and use HTTP/1.1 to the upstream. Caddy normally handles this automatically.

### Client IP is always the proxy address

Forward `X-Real-IP` and `X-Forwarded-For`, then make sure only trusted proxies can reach the backend directly.
