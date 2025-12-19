web: python manage.py collectstatic --no-input && gunicorn wellness_project.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120



