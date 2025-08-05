# 使用 Node.js 官方镜像作为基础镜像，确保版本支持 pnpm
# FROM node:18-alpine
# 安装 pnpm
# RUN npm install -g pnpm
# 设置工作目录
# WORKDIR /app
# 复制 package.json 和 pnpm-lock.yaml 到工作目录
# COPY package*.json pnpm-lock.yaml ./
# 使用 pnpm 安装项目依赖
# RUN pnpm install
# 复制项目文件到工作目录
# COPY . .
# 暴露应用运行的端口
# EXPOSE 3000
# 启动应用
# CMD pnpm start


# 生产阶段
# FROM nginx:stable-alpine AS production-stage
# 复制构建产物到nginx
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# 复制生产环境nginx配置
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露80端口
# EXPOSE 80
# 启动nginx并在前台运行
# CMD ["nginx", "-g", "daemon off;"]
FROM nginx:latest
COPY dist/  /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
