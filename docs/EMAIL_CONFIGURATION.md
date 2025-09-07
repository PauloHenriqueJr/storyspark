# 📧 Configuração do Sistema de Emails - StorySpark

## Situação Atual e Problema

Você está recebendo o erro:
```
You can only send testing emails to your own email address (paulojack2011@gmail.com). 
To send emails to other recipients, please verify a domain at resend.com/domains
```

Isso acontece porque seu token do Resend (`re_g2jbn5Pg_8pVbqLrhnxMfZ4c3ucABUzJG`) está em modo de teste.

## ✅ Solução Implementada: Sistema Híbrido

### 1. **Supabase para Emails de Autenticação**
- Emails de confirmação de cadastro
- Emails de recuperação de senha
- Emails de mudança de email
- **Vantagem**: Já funciona automaticamente, sem configuração adicional

### 2. **Resend para Emails de Marketing/Waitlist**
- Emails de confirmação da waitlist
- Emails de convite para acesso
- Campanhas de email marketing
- **Vantagem**: Melhor controle, templates avançados, analytics

## 🚀 Passos para Configurar

### Passo 1: Verificar Domínio no Resend

1. **Acesse**: https://resend.com/domains
2. **Faça login** com sua conta
3. **Adicione seu domínio**: `storyspark.com.br`
4. **Configure os registros DNS** conforme instruções do Resend:
   - SPF Record
   - DKIM Records
   - (Opcional) DMARC Record

### Passo 2: Atualizar Token de Produção

Após verificar o domínio, o Resend fornecerá um token de produção.

1. **Obtenha o novo token** em: https://resend.com/api-keys
2. **Atualize no Supabase**:
   ```sql
   -- No Supabase Dashboard > SQL Editor
   UPDATE vault.secrets 
   SET secret = 'seu_novo_token_producao'
   WHERE name = 'RESEND_API_KEY';
   ```

3. **Atualize no arquivo .env**:
   ```env
   VITE_RESEND_API_KEY=seu_novo_token_producao
   ```

### Passo 3: Configurar Emails no Supabase

No Supabase Dashboard > Authentication > Email Templates:

1. **Desabilite** os templates padrão do Supabase para waitlist
2. **Mantenha habilitados** apenas para:
   - Confirm signup
   - Reset password
   - Change email address

## 📝 Modo de Desenvolvimento (Implementado)

Para desenvolvimento local, o sistema automaticamente:

1. **Detecta modo teste** pelo formato do token
2. **Redireciona emails** para `paulojack2011@gmail.com`
3. **Loga o destinatário original** no console

## 🔧 Configuração de Domínio de Email

### Opção A: Usar Subdomínio (Recomendado)
```
email.storyspark.com.br
```
- Mais fácil de configurar
- Não interfere com email corporativo existente
- Melhor para separar transacional de marketing

### Opção B: Usar Domínio Principal
```
storyspark.com.br
```
- Mais profissional
- Requer cuidado com registros MX existentes
- Melhor para marca unificada

## 📊 Tipos de Email e Responsabilidades

| Tipo de Email | Sistema | Template | Trigger |
|--------------|---------|----------|---------|
| Confirmação de Cadastro | Supabase | Auth Template | signup |
| Recuperação de Senha | Supabase | Auth Template | password reset |
| Mudança de Email | Supabase | Auth Template | email change |
| Waitlist - Confirmação | Resend | waitlist-confirmation | waitlist signup |
| Waitlist - Convite | Resend | waitlist-invite | admin action |
| Marketing - Campanhas | Resend | campaign-* | admin campaign |

## 🎯 Checklist de Implementação

- [ ] Verificar domínio no Resend
- [ ] Configurar registros DNS
- [ ] Aguardar verificação (até 48h)
- [ ] Obter token de produção
- [ ] Atualizar token no Supabase
- [ ] Atualizar token no .env
- [ ] Testar envio para email externo
- [ ] Configurar templates no Resend
- [ ] Ativar tracking de opens/clicks

## 🛠️ Variáveis de Ambiente

### Desenvolvimento (.env.local)
```env
# Supabase
VITE_SUPABASE_URL=https://qgtgvqfikqfjbeixzbyb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Resend (modo teste)
VITE_RESEND_API_KEY=re_g2jbn5Pg_8pVbqLrhnxMfZ4c3ucABUzJG
VITE_EMAIL_FROM=teste@storyspark.com.br
VITE_EMAIL_MODE=development
```

### Produção (.env.production)
```env
# Supabase
VITE_SUPABASE_URL=https://qgtgvqfikqfjbeixzbyb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Resend (modo produção - após verificar domínio)
VITE_RESEND_API_KEY=re_live_xxxxx
VITE_EMAIL_FROM=contato@storyspark.com.br
VITE_EMAIL_MODE=production
```

## 📈 Métricas e Monitoramento

### Resend Dashboard
- Taxa de entrega
- Taxa de abertura
- Taxa de cliques
- Bounces e complaints

### Supabase Logs
- Falhas de autenticação
- Tentativas de email
- Rate limiting

## 🚨 Troubleshooting

### Problema: "Domain not verified"
**Solução**: Verificar registros DNS e aguardar propagação (até 48h)

### Problema: "Rate limit exceeded"
**Solução**: 
- Plano gratuito: 100 emails/dia
- Upgrade para plano Pro: 50.000 emails/mês

### Problema: Emails indo para spam
**Solução**:
1. Configurar SPF, DKIM e DMARC
2. Usar conteúdo não-spam
3. Incluir link de unsubscribe
4. Manter lista limpa (remover bounces)

## 📚 Links Úteis

- [Resend Dashboard](https://resend.com/dashboard)
- [Resend Domains](https://resend.com/domains)
- [Resend API Keys](https://resend.com/api-keys)
- [Supabase Email Auth](https://supabase.com/docs/guides/auth/auth-email)
- [DNS Checker](https://mxtoolbox.com/SuperTool.aspx)

## ✅ Próximos Passos Imediatos

1. **Acesse** https://resend.com/domains
2. **Verifique** o domínio `storyspark.com.br`
3. **Configure** os registros DNS
4. **Aguarde** verificação
5. **Atualize** o token para produção

Após isso, o sistema funcionará completamente!
