#!/bin/sh
set -e

echo "Waiting for database..."
i=0
while [ "$i" -lt 30 ]; do
  if bun -e "import postgres from 'postgres'; const sql = postgres(process.env.DATABASE_URL, { max: 1 }); await sql\`SELECT 1\`; await sql.end();" 2>/dev/null; then
    break
  fi
  i=$((i + 1))
  echo "  retry ${i}/30..."
  sleep 2
done

if [ "$i" -eq 30 ]; then
  echo "Database not ready after 60s"
  exit 1
fi

echo "Running migrations..."
bun run db:migrate

echo "Starting API..."
exec bun run start
