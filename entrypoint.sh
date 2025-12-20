#!/bin/sh
set -e

echo "===> Running migrations"
# If DATABASE_URL is not set, default to SQLite fallback to avoid repeated failures
if [ -z "${DATABASE_URL:-}" ] && [ "${FORCE_SQLITE:-false}" != "true" ]; then
	echo "===> DATABASE_URL not set — enabling FORCE_SQLITE=true fallback"
	export FORCE_SQLITE=true
fi

if [ "${FORCE_SQLITE:-false}" != "true" ]; then
	echo "===> Waiting for database to be ready (timeout ~60s)"
	counter=0
	until python - <<'PY'
import os,sys
try:
		import psycopg2
		d=os.environ.get('DATABASE_URL')
		if not d:
				raise RuntimeError('DATABASE_URL not set')
		conn=psycopg2.connect(d)
		conn.close()
		sys.exit(0)
except Exception as e:
		print('DB check failed:', e)
		sys.exit(1)
PY
	do
		counter=$((counter+1))
		if [ "$counter" -ge 30 ]; then
			echo "Database did not become ready after $counter attempts. Continuing and letting migrations fail if still unreachable."
			break
		fi
		sleep 2
	done
else
	echo "===> FORCE_SQLITE=true detected — skipping DB readiness wait and using SQLite fallback"
fi

python manage.py migrate --noinput

echo "===> Updating Django Site domain"
python update_site_domain.py || echo "Warning: Site domain update failed, continuing anyway"

echo "===> Collecting static files (clear old)"
python manage.py collectstatic --noinput --clear

PORT_TO_BIND=${PORT:-8000}

echo "===> Starting Gunicorn on 0.0.0.0:${PORT_TO_BIND}"
exec gunicorn wellness_project.wsgi:application --bind 0.0.0.0:${PORT_TO_BIND} --workers 3 --timeout 120
