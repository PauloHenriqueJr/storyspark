# 📧 Configuração do Sistema de Email - StorySpark

## 🌟 Status Atual

✅ **Sistema configurado e operacional em PRODUÇÃO**
- **Domínio**: `storyspark.com.br`
- **Email Remetente**: `suporte@storyspark.com.br`
- **Modo**: `production` ✨ **ATIVO - Emails sendo enviados aos destinatários reais**
- **API Key**: Full Access configurada

## 🔧 Configuração Atual

### Variáveis de Ambiente (.env)
```env
# Email - Resend
VITE_RESEND_API_KEY="re_LHhy7KDn_6zMPinnjkQWFZkhK1YzKkNj7"  # Full Access Key
VITE_EMAIL_MODE="production"  # PRODUÇÃO ATIVA
VITE_TEST_EMAIL="paulojack2011@gmail.com"
VITE_EMAIL_FROM="suporte@storyspark.com.br"
VITE_EMAIL_FROM_NAME="StorySpark"
```

### Secrets no Supabase
As mesmas configurações estão armazenadas no Supabase vault.secrets:
- `RESEND_API_KEY`: Token de acesso da API Resend
- `EMAIL_MODE`: Modo de operação (development/production)
- `TEST_EMAIL`: Email que recebe todos os emails em modo desenvolvimento
- `EMAIL_FROM`: Email remetente padrão
- `EMAIL_FROM_NAME`: Nome do remetente

## 📨 Como Funciona

### Modo Desenvolvimento (Atual)
Em modo desenvolvimento, **TODOS os emails são redirecionados** para o email de teste configurado:
1. Email original é preservado no assunto: `[DEV - Para: usuario@exemplo.com] Assunto Original`
2. Email é enviado para: `paulojack2011@gmail.com`
3. Log mostra o redirecionamento no console

### Modo Produção (Quando Ativado)
Em modo produção, os emails são enviados normalmente para os destinatários reais.

## 🚀 Como Ativar Modo Produção

### Passo 1: Verificar Domínio no Resend

1. Acesse [Resend Dashboard](https://resend.com/domains)
2. Adicione o domínio `storyspark.com.br`
3. Configure os registros DNS conforme instruído:

#### Registros DNS Necessários
```
Tipo: TXT
Nome: resend._domainkey
Valor: [fornecido pelo Resend]

Tipo: TXT  
Nome: @
Valor: resend-verification=[código fornecido]

Tipo: MX (opcional, para receber respostas)
Nome: @
Valor: feedback-smtp.sa-east-1.amazonses.com
Prioridade: 10
```

### Passo 2: Obter API Key de Produção

1. Após verificar o domínio
2. Gere uma nova API key no modo "Live"
3. A key terá formato: `re_xxxxx_xxxxxxxxxxxxxxxx` (note o "_live_")

### Passo 3: Atualizar Configurações

#### No arquivo `.env`:
```env
VITE_RESEND_API_KEY="sua_nova_api_key_live"
VITE_EMAIL_MODE="production"
```

#### No Supabase (via SQL):
```sql
UPDATE vault.secrets 
SET secret = 'sua_nova_api_key_live'
WHERE name = 'RESEND_API_KEY';

UPDATE vault.secrets 
SET secret = 'production'
WHERE name = 'EMAIL_MODE';
```

### Passo 4: Redeployar Edge Function
```bash
npx supabase functions deploy send-email --project-ref qgtgvqfikqfjbeixzbyb
```

## 📋 Tipos de Email Enviados

### 1. Emails de Autenticação (Supabase)
- **Confirmação de cadastro**
- **Recuperação de senha**
- **Mudança de email**
- ⚠️ Estes usam o sistema próprio do Supabase

### 2. Emails da Waitlist (Resend)
- **Confirmação de inscrição**: Enviado quando usuário se inscreve
- **Convite para acesso**: Enviado quando usuário é aprovado
- ✅ Estes usam o sistema Resend configurado

### 3. Emails Marketing (Resend)
- **Newsletters**
- **Promoções**
- **Atualizações do produto**
- ✅ Estes usam o sistema Resend configurado

## 🧪 Testando o Sistema

### Teste Manual via Terminal
```bash
# Teste de email básico
curl -X POST https://qgtgvqfikqfjbeixzbyb.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "teste@exemplo.com",
    "subject": "Teste de Email",
    "html": "<h1>Olá!</h1><p>Este é um teste.</p>"
  }'
```

### Teste via Interface
1. Acesse sua aplicação
2. Inscreva-se na waitlist
3. Verifique o email de teste configurado
4. O email deve chegar com subject: `[DEV - Para: seu@email.com] Bem-vindo ao StorySpark!`

## 🔍 Monitoramento

### Logs da Edge Function
```bash
npx supabase functions logs send-email --project-ref qgtgvqfikqfjbeixzbyb
```

### Dashboard Resend
- Acesse: [resend.com/emails](https://resend.com/emails)
- Veja status de cada email enviado
- Monitore taxa de entrega e bounces

## ⚠️ Troubleshooting

### Email não chega
1. **Verifique os logs** da Edge Function
2. **Confirme o token** Resend está correto
3. **Verifique o modo** (development vs production)
4. **Teste com curl** direto na Edge Function

### Erro 403 do Resend
- Token em modo teste tentando enviar para email não verificado
- Solução: Use modo production com domínio verificado

### Erro de CORS
- Edge Function já tem headers CORS configurados
- Se persistir, verifique origem da requisição

## 📊 Métricas e Analytics

### KPIs para Monitorar
- **Taxa de Entrega**: > 95% esperado
- **Taxa de Abertura**: > 20% para marketing
- **Taxa de Clique**: > 2% para CTAs
- **Bounces**: < 2% aceitável
- **Spam Reports**: < 0.1% ideal

### Ferramentas de Analytics
1. **Resend Dashboard**: Métricas básicas
2. **Google Analytics**: Tracking de conversões
3. **Supabase Dashboard**: Logs e performance

## 🔐 Segurança

### Boas Práticas Implementadas
✅ API keys armazenadas em variáveis de ambiente
✅ Secrets protegidos no Supabase vault
✅ Validação de entrada na Edge Function
✅ Rate limiting automático do Resend
✅ Logs sem exposição de dados sensíveis

### Recomendações Adicionais
- [ ] Implementar rate limiting adicional
- [ ] Adicionar webhook para bounce handling
- [ ] Configurar DMARC/SPF/DKIM completo
- [ ] Implementar lista de emails bloqueados
- [ ] Adicionar assinatura digital nos emails

## 📝 Próximos Passos

1. **Verificar domínio no Resend** ⏰
2. **Configurar DNS** ⏰
3. **Obter API key de produção** ⏰
4. **Ativar modo produção** ⏰
5. **Testar envio real** ⏰
6. **Configurar templates avançados** 📋
7. **Implementar analytics detalhado** 📊
8. **Adicionar automações de marketing** 🤖

## 📞 Suporte

### Resend
- Documentação: https://resend.com/docs
- Status: https://status.resend.com
- Suporte: support@resend.com

### StorySpark
- Email: suporte@storyspark.com.br
- Desenvolvedor: paulojack2011@gmail.com

---

**Última atualização**: Janeiro 2025
**Versão**: 2.0.0
**Status**: 🚀 Operacional em modo PRODUÇÃO com Full Access
