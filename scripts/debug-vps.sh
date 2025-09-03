#!/bin/bash

echo "🔍 StorySpark VPS Diagnostic Script"
echo "=================================="
echo ""

echo "📁 Current Directory:"
pwd
echo ""

echo "📂 Project Files:"
ls -la /root/projetos/storyspark/
echo ""

echo "🐳 All Docker Containers:"
docker ps -a
echo ""

echo "📋 Docker Compose Status:"
cd /root/projetos/storyspark
docker-compose ps
echo ""

echo "🔍 StorySpark Container Logs (last 50 lines):"
docker-compose logs --tail=50 storyspark-app
echo ""

echo "🌐 Traefik Status:"
docker ps | grep traefik
echo ""

echo "📊 Traefik Logs (last 20 lines):"
docker logs traefik --tail=20
echo ""

echo "🔗 Network Status:"
docker network ls
echo ""

echo "💾 Disk Usage:"
df -h
echo ""

echo "🔄 Recent Docker Events:"
docker events --since 30m --until now
echo ""

echo "✅ Diagnostic Complete!"
