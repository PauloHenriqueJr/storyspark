# 🚀 Fluxo de Deploy - StorySpark

## 📋 **Fluxo Completo de Deploy**

### 🖥️ **1. No seu PC Windows (onde você está agora):**

```bash
# 1. Fazer suas alterações no código
# 2. Testar localmente
npm run dev

# 3. Commit e push para GitHub
git add .
git commit -m "feat: configuração Docker e deploy"
git push origin main
```

### 🌐 **2. Na VPS (executa UMA VEZ para setup):**

```bash
# Acessar VPS via SSH
ssh root@seu-ip-vps

# Ir para diretório do projeto
cd /root/projetos/storyspark

# Executar script de setup inicial
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

### ⚙️ **3. Configurar GitHub Actions (no navegador):**

1. Vá em `https://github.com/PauloHenriqueJr/storyspark`
2. `Settings > Secrets and Variables > Actions`
3. Adicione os secrets:

| Secret         | Valor                      |
| -------------- | -------------------------- |
| `VPS_HOST`     | IP da sua VPS              |
| `VPS_USERNAME` | `root`                     |
| `VPS_SSH_KEY`  | Chave SSH privada completa |
| `VPS_PORT`     | `22`                       |

### 🌐 **4. Configurar DNS:**

Configure estes registros A no seu provedor de domínio:
```
A     @                    IP-DA-VPS
A     www                  IP-DA-VPS
A     app                  IP-DA-VPS
A     admin                IP-DA-VPS
```

### 📝 **5. Configurar Variáveis de Ambiente na VPS:**

```bash
# Na VPS, editar arquivo .env
nano /root/projetos/storyspark/.env

# Configurar com seus dados reais:
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-real
```

### 🚀 **6. Deploy Automático:**

```bash
# No seu PC Windows, qualquer push para main trigga deploy
git add .
git commit -m "deploy: primeira versão"
git push origin main

# GitHub Actions automaticamente:
# ✅ Build da aplicação
# ✅ Testes
# ✅ Build da imagem Docker  
# ✅ Push para registry
# ✅ Deploy na VPS
# ✅ Health checks
```

---

## 🔄 **Fluxo Diário de Trabalho:**

### 💻 **No PC (desenvolvimento):**
```bash
# 1. Desenvolver localmente
npm run dev

# 2. Testar mudanças
npm run build

# 3. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 4. GitHub Actions faz deploy automático! ✨
```

### 📊 **Monitorar Deploy:**
1. Vá em `Actions` no GitHub
2. Acompanhe o workflow `Deploy StorySpark to VPS`
3. Veja logs em tempo real
4. Aplicação atualizada em https://app.storyspark.com.br

---

## 🛠️ **Comandos Úteis:**

### 🔍 **Verificar Status na VPS:**
```bash
ssh root@seu-ip-vps
cd /root/projetos/storyspark

# Ver containers rodando
docker-compose ps

# Ver logs da aplicação  
docker-compose logs -f storyspark-app

# Health check
curl localhost:3000/health.html
```

### 🔄 **Deploy Manual (se necessário):**
```bash
# Na VPS
cd /root/projetos/storyspark
git pull origin main
docker-compose down
docker build -t storyspark:latest .
docker-compose up -d
```

### 🧹 **Limpeza na VPS:**
```bash
# Remover imagens antigas
docker system prune -f

# Reiniciar aplicação
docker-compose restart
```

---

## ✅ **Resultado Final:**

Após configurar tudo:

- 💻 **Você desenvolve no Windows**
- 🚀 **Faz git push**  
- 🤖 **GitHub Actions deploxa automaticamente**
- 🌐 **Aplicação fica online em minutos**

**URLs Finais:**
- 🌐 https://www.storyspark.com.br (Landing)
- 📱 https://app.storyspark.com.br (App)
- 🔧 https://admin.storyspark.com.br (Admin)

---

## 🆘 **Troubleshooting:**

### ❌ **Deploy falha:**
1. Verificar secrets no GitHub
2. Verificar se VPS está acessível via SSH
3. Ver logs do GitHub Actions

### 🌐 **Domínio não funciona:**
1. Verificar DNS (pode demorar até 24h)
2. Verificar se Traefik está rodando
3. Ver logs do Traefik: `docker logs traefik`

### 🐳 **Container não sobe:**
1. Ver logs: `docker-compose logs -f`
2. Verificar .env na VPS
3. Verificar health check: `curl localhost:3000/health.html`

**🎯 Fluxo simples: Windows → GitHub → VPS automático!**
