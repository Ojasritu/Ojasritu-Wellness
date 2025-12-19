# Stage 1: Build frontend
FROM node:18 AS frontend-builder

WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm install --legacy-peer-deps
COPY frontend frontend/
RUN cd frontend && chmod +x build.sh && ./build.sh

# Stage 2: Python application
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy built frontend files
COPY --from=frontend-builder /app/frontend/dist /app/staticfiles/frontend

# Collect static files
RUN python manage.py collectstatic --noinput

# Add an entrypoint to run migrations and collectstatic at container start
COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=wellness_project.settings

# Expose port (Railway sets runtime PORT environment variable)
EXPOSE 8080

# Start via entrypoint (runs migrate + collectstatic then gunicorn)
CMD ["sh", "./entrypoint.sh"]
