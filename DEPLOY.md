# 🚀 Guia de Deploy - StorySpark

Este documento descreve como configurar e fazer deploy da aplicação StorySpark usando Docker, Docker Compose e Traefik na sua VPS.

## 📋 Pré-requisitos

### Na sua VPS:
- Ubuntu 20.04+ ou CentOS 8+
- Acesso root ou sudo
- Portas 80, 443 e 22 abertas
- Domínio configurado com DNS apontando para a VPS

### No GitHub:
- Repositório com os arquivos Docker
- GitHub Actions habilitado
- Secrets configurados

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                        Internet                          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    Traefik                              │
│              (Proxy Reverso + SSL)                     │
└┬────────┬────────┬────────┬────────┬───────────────────┘
 │        │        │        │        │
 ▼        ▼        ▼        ▼        ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────────┐
│ WWW │ │ APP │ │API  │ │ADMIN│ │  DOCS   │
│     │ │     │ │     │ │     │ │         │
└─────┘ └─────┘ └─────┘ └─────┘ └─────────┘
```

## 🔧 Configuração Inicial da VPS

### 1. Preparar VPS
```bash
# Conectar na VPS
ssh root@seu-ip-da-vps

# Baixar e executar script de setup
wget https://raw.githubusercontent.com/PauloHenriqueJr/storyspark/main/scripts/deploy-vps.sh
chmod +x deploy-vps.sh
./deploy-vps.sh
```

### 2. Configurar DNS
Aponte os seguintes registros para o IP da sua VPS:
```
A     @                    ip-da-vps
A     www                  ip-da-vps
A     app                  ip-da-vps
A     api                  ip-da-vps
A     admin                ip-da-vps
A     docs                 ip-da-vps
CNAME traefik              storyspark.com.br
```

## 🔐 Configurar Secrets no GitHub

Vá em `Settings > Secrets and Variables > Actions` e adicione:

| Secret         | Descrição         | Exemplo                                  |
| -------------- | ----------------- | ---------------------------------------- |
| `VPS_HOST`     | IP da VPS         | `192.168.1.100`                          |
| `VPS_USERNAME` | Usuário SSH       | `root`                                   |
| `VPS_SSH_KEY`  | Chave SSH privada | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT`     | Porta SSH         | `22`                                     |

### Gerar chave SSH (se necessário):
```bash
# Na sua máquina local
ssh-keygen -t ed25519 -C "deploy@storyspark"

# Copiar chave pública para VPS
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@ip-da-vps

# Usar chave privada como secret VPS_SSH_KEY
cat ~/.ssh/id_ed25519
```

## 🚀 Deploy Automático

### 1. Primeiro Deploy
```bash
# Fazer push para main
git add .
git commit -m "feat: configuração Docker e CI/CD"
git push origin main
```

### 2. Acompanhar Deploy
- Vá em `Actions` no GitHub
- Acompanhe o workflow `Deploy StorySpark to VPS`
- Verifique se todos os jobs passaram

### 3. Verificar Aplicação
Após o deploy, acesse:
- 🌐 **Landing**: https://www.storyspark.com.br
- 📱 **App**: https://app.storyspark.com.br
- 🔧 **Admin**: https://admin.storyspark.com.br
- 📚 **Docs**: https://docs.storyspark.com.br
- 🔗 **API**: https://api.storyspark.com.br

## 🛠️ Comandos Úteis na VPS

### Verificar Status
```bash
cd /opt/storyspark
docker-compose ps
docker-compose logs -f
```

### Reiniciar Serviços
```bash
cd /opt/storyspark
docker-compose restart
```

### Atualizar Manualmente
```bash
cd /opt/storyspark
docker-compose down
docker pull ghcr.io/paulohenriquejr/storyspark:latest
docker-compose up -d
```

### Verificar Traefik
```bash
cd /opt/traefik
docker-compose logs -f traefik
```

### Ver Certificados SSL
```bash
docker exec traefik traefik version
curl -k https://traefik.storyspark.com.br/api/rawdata
```

## 🔄 Atualizações Automáticas

O sistema está configurado para auto-deploy:
1. **Push para `main`** → Trigger automático
2. **Build** → GitHub Actions constrói imagem
3. **Deploy** → Atualiza VPS automaticamente
4. **Verificação** → Health checks validam deploy

## 🐛 Troubleshooting

### Deploy falha
```bash
# Verificar logs do GitHub Actions
# Verificar conexão SSH
ssh -v root@ip-da-vps

# Verificar Docker na VPS
docker ps
docker-compose ps
```

### Certificados SSL não funcionam
```bash
# Verificar logs do Traefik
docker logs traefik

# Verificar arquivo de certificados
ls -la /opt/traefik/data/acme.json

# Recriar certificados
docker exec traefik rm -f /acme.json
docker-compose restart traefik
```

### App não carrega
```bash
# Verificar logs da aplicação
docker-compose logs storyspark-app

# Verificar health check
curl http://localhost/health

# Verificar nginx
docker exec storyspark-app nginx -t
```

### DNS não resolve
```bash
# Verificar DNS
nslookup app.storyspark.com.br
dig app.storyspark.com.br

# Verificar se Traefik está recebendo requisições
docker logs traefik | grep app.storyspark.com.br
```

## 📊 Monitoramento

### Logs Centralizados
```bash
# Ver todos os logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f storyspark-app
docker-compose logs -f traefik
```

### Métricas de Sistema
```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h
docker system df

# Limpeza
docker system prune -f
```

## 🔒 Segurança

### Firewall
```bash
# Configurar UFW (Ubuntu)
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### Backup
```bash
# Backup da configuração
tar -czf storyspark-config-$(date +%Y%m%d).tar.gz /opt/storyspark /opt/traefik

# Backup dos certificados SSL
cp /opt/traefik/data/acme.json /backup/acme-$(date +%Y%m%d).json
```

### Atualizações do Sistema
```bash
# Ubuntu
apt update && apt upgrade -y

# CentOS
yum update -y
```

## 📞 Suporte

Em caso de problemas:
1. Verificar logs dos containers
2. Verificar configuração do DNS
3. Verificar secrets do GitHub
4. Verificar conectividade SSH
5. Consultar documentação do Traefik

---

**Última atualização**: $(date)
**Versão**: 1.0.0
