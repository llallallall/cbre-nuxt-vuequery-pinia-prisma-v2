#!/bin/bash

# 컨테이너 이름 및 이미지 설정
CONTAINER_NAME="cbre-web"
IMAGE_NAME="ghcr.io/llallallall/cbre-nuxt-vuequery-pinia-prisma-v2:latest"
ENV_FILE="/home/mhh/cbre-web-config/.env"

echo "🚀 Redeploying $CONTAINER_NAME..."

# 1. 최신 이미지 풀 (선택 사항, 필요시 주석 해제)
# echo "📥 Pulling latest image..."
# docker pull $IMAGE_NAME

# 2. 기존 컨테이너 중지 및 삭제
echo "🛑 Stopping and removing existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 3. 새 컨테이너 실행
echo "▶️ Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  --network cbre-net \
  --env-file $ENV_FILE \
  $IMAGE_NAME

echo "✅ Deployment complete!"
docker ps | grep $CONTAINER_NAME
