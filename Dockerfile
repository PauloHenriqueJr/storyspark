# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências
RUN npm ci --frozen-lockfile

# Copiar código fonte
COPY . .

# Copy production environment configuration if exists
COPY .env.production ./ 2>/dev/null || true

# Build da aplicação com configurações de produção
ENV NODE_ENV=production
RUN npm run build

# Estágio de produção - Servir arquivos estáticos diretamente
FROM node:18-alpine AS production

# Instalar serve para servir arquivos estáticos
RUN npm install -g serve

# Instalar curl para health checks
RUN apk --no-cache add curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiar build da aplicação
COPY --from=builder --chown=nextjs:nodejs /app/dist /app

# Create serve configuration with HTTPS-friendly security headers
RUN echo '{ \
  "public": "/app", \
  "rewrites": [ \
    { "source": "**", "destination": "/index.html" } \
  ], \
  "headers": [ \
    { \
      "source": "**", \
      "headers": [ \
        { "key": "X-Content-Type-Options", "value": "nosniff" }, \
        { "key": "X-Frame-Options", "value": "DENY" }, \
        { "key": "X-XSS-Protection", "value": "1; mode=block" }, \
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, \
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" } \
      ] \
    } \
  ] \
}' > /serve.json

# Mudar para usuário não-root
USER nextjs

# Definir diretório de trabalho
WORKDIR /app

# Expor porta 3000 (serve usa 3000 por padrão)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Comando para servir a aplicação com configuração de segurança
CMD ["serve", "-c", "/serve.json", "-l", "3000", "/app"]

# Comando para iniciar o servidor de arquivos estáticos
CMD ["serve", "-s", ".", "-l", "3000", "--no-clipboard"]
