#!/usr/bin/env bash
set -euo pipefail

bash scripts/root-guard.sh >/dev/null

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker Engine or Docker Desktop with Compose v2 is required." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required (the 'docker compose' command)." >&2
  exit 1
fi

cleanup_on_failure() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    echo
    echo "Docker verification failed. Recent service logs:" >&2
    docker compose logs --tail=120 web worker db-init postgres redis minio 2>/dev/null || true
  fi
  exit "$exit_code"
}
trap cleanup_on_failure EXIT

echo "[docker-verify] validating Compose configuration"
docker compose config --quiet

echo "[docker-verify] building and starting the complete stack"
docker compose up --build -d

echo "[docker-verify] waiting for web health"
for attempt in $(seq 1 60); do
  if docker compose exec -T web node -e "fetch('http://127.0.0.1:3000/api/health').then(async r=>{const b=await r.json();if(!r.ok||b.ok!==true)process.exit(1)}).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    break
  fi
  if [[ $attempt -eq 60 ]]; then
    echo "Web health did not become ready." >&2
    exit 1
  fi
  sleep 2
done

echo "[docker-verify] checking PostgreSQL schema and seed"
PROMPT_COUNT="$(docker compose exec -T postgres sh -lc 'PGPASSWORD="${POSTGRES_PASSWORD:-limitless}" psql -U "${POSTGRES_USER:-limitless}" -d "${POSTGRES_DB:-limitless}" -tAc "SELECT count(*) FROM prompts;"' | tr -d '[:space:]')"
if [[ ! "$PROMPT_COUNT" =~ ^[0-9]+$ ]] || (( PROMPT_COUNT < 20 )); then
  echo "Expected at least 20 seeded prompts; found '${PROMPT_COUNT:-unknown}'." >&2
  exit 1
fi

echo "[docker-verify] checking Redis"
REDIS_RESPONSE="$(docker compose exec -T redis redis-cli ping | tr -d '\r')"
[[ "$REDIS_RESPONSE" == "PONG" ]] || { echo "Redis did not return PONG." >&2; exit 1; }

echo "[docker-verify] checking private evidence bucket"
docker compose run --rm --no-deps --entrypoint /bin/sh minio-init -ec '
  mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null
  mc stat "local/$OBJECT_STORAGE_BUCKET" >/dev/null
'

echo "[docker-verify] checking worker readiness"
docker compose exec -T worker node -e "require('node:fs').accessSync('/tmp/limitless-worker-ready')"

echo "[docker-verify] checking public host endpoint"
HOST_URL="http://${WEB_BIND_ADDRESS:-127.0.0.1}:${WEB_PORT:-3000}/api/health"
node -e "fetch(process.argv[1]).then(async r=>{const b=await r.json();if(!r.ok||b.ok!==true)process.exit(1);console.log(JSON.stringify(b,null,2))}).catch(e=>{console.error(e);process.exit(1)})" "$HOST_URL"

echo
docker compose ps
echo
echo "PASS: Limitless Architecting OS is running at http://${WEB_BIND_ADDRESS:-127.0.0.1}:${WEB_PORT:-3000}"
trap - EXIT
