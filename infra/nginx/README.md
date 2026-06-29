# Nginx (Docker)

Nginx chạy trong Docker Compose — không cần cài Nginx trên EC2.

## Flow

```
Internet :80
    → portfolio-nginx (container)
        → api:3001   (api.toanhodev.com)
        → bo:3002    (bo.toanhodev.com)
```

Config nằm tại `conf.d/*.conf`. Sửa file → reload nginx:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Deploy trên EC2

```bash
cd /opt/portfolio
git pull origin dev
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Test:

- http://api.toanhodev.com/swagger
- http://bo.toanhodev.com/login

## SSL (bước sau)

Port 443 đã map sẵn. Phase tiếp theo: certbot + mount cert vào nginx container.
