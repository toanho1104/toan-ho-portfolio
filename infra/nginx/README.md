# Nginx + SSL (Docker)

## Flow

```
Internet :80 / :443
    → portfolio-nginx
        → toanhodev.com      → web:3000
        → api.toanhodev.com  → api:3001
        → bo.toanhodev.com   → bo:3002
```

## Deploy

```bash
cd /opt/portfolio
git pull origin dev
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Test:

- http://toanhodev.com
- http://api.toanhodev.com/swagger
- http://bo.toanhodev.com/login

## SSL

Thêm `CERTBOT_EMAIL` vào `.env.production`, rồi:

```bash
set -a && source .env.production && set +a

docker compose --env-file .env.production -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  -d toanhodev.com -d www.toanhodev.com \
  -d api.toanhodev.com -d bo.toanhodev.com \
  --email "$CERTBOT_EMAIL" --agree-tos --non-interactive
```

Đã có cert (chỉ api/bo) → thêm domain:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot -w /var/www/certbot --expand \
  -d toanhodev.com -d www.toanhodev.com \
  -d api.toanhodev.com -d bo.toanhodev.com \
  --email "$CERTBOT_EMAIL" --agree-tos --non-interactive
```

Bật HTTPS:

```bash
cp infra/nginx/ssl/api.conf infra/nginx/conf.d/api.conf
cp infra/nginx/ssl/bo.conf infra/nginx/conf.d/bo.conf
cp infra/nginx/ssl/web.conf infra/nginx/conf.d/web.conf
docker compose --env-file .env.production -f docker-compose.prod.yml exec nginx nginx -s reload
```

Rebuild apps sau khi đổi `NEXT_PUBLIC_API_URL=https://api.toanhodev.com`:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build bo web
```
