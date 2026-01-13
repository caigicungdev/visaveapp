#!/bin/bash

# V-Tool Deployment Script for Hetzner VPS
# Usage: ./deploy.sh [domain]

set -e

DOMAIN=${1:-$(grep DOMAIN .env | cut -d '=' -f2)}

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Domain not specified"
    echo "Usage: ./deploy.sh your-domain.com"
    echo "  or set DOMAIN in .env file"
    exit 1
fi

echo "🚀 Deploying V-Tool to ${DOMAIN}..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "⚠️  Please log out and back in, then run this script again"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

# Update nginx.conf with actual domain
echo "🔧 Configuring Nginx for ${DOMAIN}..."
sed -i "s/your-domain.com/${DOMAIN}/g" nginx.conf

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Initial SSL certificate (staging first for testing)
echo "🔐 Obtaining SSL certificate..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@${DOMAIN} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN}

# Build and start services
echo "🏗️  Building Docker images..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Health check
echo "🔍 Running health check..."
if curl -s http://localhost/health | grep -q "healthy"; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed, checking logs..."
    docker compose logs backend --tail=20
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site is live at: https://${DOMAIN}"
echo ""
echo "📋 Useful commands:"
echo "   docker compose logs -f          # View logs"
echo "   docker compose ps               # View status"
echo "   docker compose restart          # Restart services"
echo "   docker compose down             # Stop services"
echo "   docker compose up -d --build    # Rebuild and restart"
