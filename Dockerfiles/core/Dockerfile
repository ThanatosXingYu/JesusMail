FROM --platform=$BUILDPLATFORM golang:1.24-alpine AS builder
ARG TARGETOS=linux
ARG TARGETARCH
WORKDIR /src
COPY core/go.mod core/go.sum ./
RUN go mod download
COPY core/ ./
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -trimpath -ldflags="-s -w" -o /out/jesusmail .

FROM alpine:3.20

LABEL maintainer="JesusMail Project"

# Set environment variables
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8


# Platform-specific binary copy
ARG TARGETARCH
COPY --from=builder /out/jesusmail /opt/jesusmail/core/jesusmail
COPY core/manifest /opt/jesusmail/core/manifest
COPY core/languages /opt/jesusmail/core/languages
COPY core/public /opt/jesusmail/core/public
COPY core/resource /opt/jesusmail/core/resource
COPY core/template /opt/jesusmail/core/template

# Copy file
# COPY repositories /etc/apk/repositories
COPY Dockerfiles/core/stop-supervisor.sh /stop-supervisor.sh
COPY Dockerfiles/core/core.sh /core.sh
COPY Dockerfiles/core/restart_fail2ban.sh /restart_fail2ban.sh

# Install dependencies (using Alpine's apk package manager)
RUN apk add --no-cache \
    bash \
    ca-certificates \
    curl \
    supervisor \
    rsyslog \
    tzdata \
    busybox-extras \
    postgresql-client \
    fail2ban \
    iptables \
    ipset \
    && rm -rf /var/cache/apk/* \
    && chmod +x /stop-supervisor.sh /core.sh /restart_fail2ban.sh /opt/jesusmail/core/jesusmail

# Copy file

COPY Dockerfiles/core/supervisord.conf /etc/supervisor/supervisord.conf
COPY Dockerfiles/core/fail2ban.conf /etc/fail2ban/fail2ban.conf


ENTRYPOINT ["/core.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]