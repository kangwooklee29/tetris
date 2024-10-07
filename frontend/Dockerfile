# nginx 이미지를 기반으로 설정
FROM nginx:alpine AS runtime

# Node.js 이미지를 기반으로 설정
FROM node:16 AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사
COPY package.json package-lock.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# TypeScript를 JavaScript로 컴파일
RUN npm run build

# 빌드된 파일을 nginx의 기본 경로로 복사
FROM runtime
COPY --from=build /app/build /usr/share/nginx/html

# nginx 포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]