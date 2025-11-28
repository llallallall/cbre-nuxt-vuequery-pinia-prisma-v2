# 1. 빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 Prisma 클라이언트 생성
COPY . .
RUN npx prisma generate

# Nuxt 빌드
RUN npm run build

# 2. 실행 단계 (가벼운 이미지 생성)
FROM node:20-alpine AS runner
WORKDIR /app

# 빌드 결과물만 가져옴
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 환경 변수 설정 (기본값)
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

# 서버 실행
CMD ["node", ".output/server/index.mjs"]