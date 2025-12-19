#!/bin/bash
set -e

echo "This helper checks Railway authentication and then runs the deployment script."

if ! command -v railway &> /dev/null; then
  echo "Railway CLI not found. Please install: npm i -g @railway/cli"
  exit 1
fi

echo "Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
  echo "You are not logged in to Railway. Run: railway login --browserless and complete the pairing in your browser."
  exit 1
fi

echo "Authenticated as: $(railway whoami)"

echo "Running deploy-railway.sh"
./deploy-railway.sh
