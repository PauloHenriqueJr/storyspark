#!/bin/bash

echo "🔍 StorySpark Deployment Diagnostic"
echo "==================================="

echo ""
echo "📊 All Docker Containers:"
docker ps -a

echo ""
echo "🎯 StorySpark Containers Status:"
docker ps | grep storyspark || echo "❌ No StorySpark containers found"

echo ""
echo "🌐 Traefik Network Inspection:"
docker network inspect traefik

echo ""
echo "📋 StorySpark Container Logs:"
echo "--- App Logs ---"
docker logs storyspark-app --tail=20 2>/dev/null || echo "No app logs"
echo "--- WWW Logs ---"  
docker logs storyspark-www --tail=20 2>/dev/null || echo "No www logs"
echo "--- Admin Logs ---"
docker logs storyspark-admin --tail=20 2>/dev/null || echo "No admin logs"

echo ""
echo "🔍 Traefik Logs:"
docker logs traefik --tail=30

echo ""
echo "🏷️ Container Labels Check:"
docker inspect storyspark-app | grep -A 20 Labels 2>/dev/null || echo "No app container"

echo ""
echo "✅ Diagnostic Complete"
