#!/bin/bash

# Script de deploy do StorySpark na VPS
# Execute este script como root na sua VPS

set -e

echo "🚀 Configurando StorySpark na VPS..."

# Definir variáveis
PROJECT_DIR="${STORYSPARK_DIR:-/root/projetos/storyspark}"
DOMAIN="storyspark.com.br"
# Criar diretório do projeto
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se Traefik está rodando
if ! docker ps | grep -q traefik; then
    echo "❌ Traefik não está rodando. Configure o Traefik primeiro."
    echo "📦 Containers em execução:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
    exit 1fi

echo "✅ Docker e Traefik detectados!"

# Verificar se a rede traefik existe
if ! docker network ls | grep -q traefik; then
    echo "📡 Criando rede traefik..."
    docker network create traefik
else
    echo "✅ Rede traefik já existe!"
fi

# Voltar para diretório do StorySpark
cd $PROJECT_DIR

# Verificar se o projeto existe
if [ ! -f "package.json" ]; then
    echo "❌ Projeto StorySpark não encontrado em $PROJECT_DIR"
    echo "📋 Certifique-se de que o projeto foi clonado neste diretório"
    exit 1
fi

echo "✅ Projeto StorySpark detectado!"

# Configurar variáveis de ambiente se necessário
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Configurações do StorySpark - PRODUÇÃO
# ⚠️  CONFIGURE SUAS VARIÁVEIS REAIS AQUI

# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Ambiente
NODE_ENV=production
REACT_APP_ENVIRONMENT=production

# Domínios
REACT_APP_APP_DOMAIN=app.storyspark.com.br
REACT_APP_API_DOMAIN=api.storyspark.com.br
REACT_APP_ADMIN_DOMAIN=admin.storyspark.com.br
REACT_APP_LANDING_DOMAIN=www.storyspark.com.br

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true

EOF
    echo "⚠️  Configure as variáveis em $PROJECT_DIR/.env"
fi

# Adicionar middlewares do Traefik se não existirem
TRAEFIK_DIR="/opt/traefik"
if [ -d "$TRAEFIK_DIR" ]; then
    echo "🔧 Configurando middlewares do Traefik..."
    
    # Criar diretório de rules se não existir
    mkdir -p $TRAEFIK_DIR/rules
    
    # Criar middlewares para StorySpark
    cat > $TRAEFIK_DIR/rules/storyspark-middlewares.yml << 'EOF'
http:
  middlewares:
    security-headers:
      headers:
        customRequestHeaders:
          X-Forwarded-Proto: "https"
        customResponseHeaders:
          X-Frame-Options: "DENY"
          X-Content-Type-Options: "nosniff" 
          X-XSS-Protection: "1; mode=block"
          Strict-Transport-Security: "max-age=31536000; includeSubDomains"
          Referrer-Policy: "strict-origin-when-cross-origin"
          Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"

    admin-auth:
      basicAuth:
        users:
          - "admin:$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"
EOF

    # Reiniciar Traefik para carregar os middlewares
    docker restart traefik || echo "⚠️  Não foi possível reiniciar o Traefik automaticamente"
fi

echo "✅ Setup inicial concluído!"
echo "📱 Aplicação estará disponível em:"
echo "   🌐 https://www.storyspark.com.br (Landing)"
echo "   📱 https://app.storyspark.com.br (App)"
echo "   🔧 https://admin.storyspark.com.br (Admin)"

echo ""
echo "🚀 Para fazer o primeiro deploy:"
echo "   1. Configure os secrets no GitHub Actions"
echo "   2. Configure as variáveis no arquivo .env"
echo "   3. Faça push para a branch main"
echo "   4. O GitHub Actions fará o deploy automático"

echo ""
echo "📋 Próximos passos:"
echo "   • Configurar DNS para apontar para este servidor"
echo "   • Configurar variáveis de ambiente em .env"
echo "   • Configurar secrets do GitHub Actions"
echo "   • Fazer primeiro deploy via Git push"
