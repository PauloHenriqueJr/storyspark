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

# Build da aplicação
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

# Mudar para usuário não-root
USER nextjs

# Definir diretório de trabalho
WORKDIR /app

# Expor porta 3000 (serve usa 3000 por padrão)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health.html || exit 1

# Comando para iniciar o servidor de arquivos estáticos
CMD ["serve", "-s", ".", "-l", "3000", "--no-clipboard"]
