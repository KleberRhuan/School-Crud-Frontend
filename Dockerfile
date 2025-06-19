# ========================================
# STAGE 1: Build da aplicação
# ========================================
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
ENV NODE_ENV=production VITE_NODE_ENV=production
RUN pnpm run build

# ========================================
# STAGE 2: Servidor de produção
# ========================================
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S appgroup \
 && adduser -S appuser -u 1001 -G appgroup \
 && chown -R appuser:appgroup /app

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]
