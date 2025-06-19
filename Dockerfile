# Dockerfile para Houer Frontend
# Multi-stage build para otimizar tamanho da imagem

# ========================================
# STAGE 1: Build da aplicação
# ========================================
FROM node:20-alpine AS builder

# Instalar dependências do sistema necessárias
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências com cache otimizado
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copiar código fonte
COPY . .

# Configurar variáveis de ambiente para build
ENV NODE_ENV=production
ENV VITE_NODE_ENV=production

# Executar build da aplicação
RUN npm run build

# ========================================
# STAGE 2: Servidor de produção
# ========================================
FROM nginx:1.25-alpine AS production

# Instalar dependências mínimas
RUN apk add --no-cache curl

# Remover configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos buildados do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Definir permissões corretas
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Criar diretórios necessários com permissões corretas
RUN touch /var/run/nginx.pid && \
    chown nextjs:nodejs /var/run/nginx.pid

# Expor porta
EXPOSE 3000

# Definir usuário não-root
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"] 