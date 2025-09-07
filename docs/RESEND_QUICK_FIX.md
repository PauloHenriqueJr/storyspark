# 🚀 Solução Rápida - Emails da Waitlist

## Status Atual ✅

Seu sistema está configurado e funcionando em **MODO DESENVOLVIMENTO**:
- ✅ Edge Function atualizada e deployada
- ✅ Variáveis de ambiente configuradas no Supabase
- ✅ Emails sendo redirecionados para `paulojack2011@gmail.com`

## O que está acontecendo agora:

1. **Emails de Waitlist**: Todos os emails estão sendo enviados para `paulojack2011@gmail.com`
2. **Subject Modificado**: Os emails têm `[DEV - Para: email@original.com]` no assunto
3. **Funcionamento**: O sistema está funcionando, mas em modo teste

## Para Ativar Modo Produção (Enviar para emails reais):

### Passo 1: Verificar Domínio no Resend

1. **Acesse**: https://resend.com/domains
2. **Faça login** com sua conta
3. **Clique em "Add Domain"**
4. **Digite**: `storyspark.com.br`
5. **Copie os registros DNS** que aparecerem

### Passo 2: Configurar DNS

Adicione os seguintes registros no seu provedor de DNS:

```
Tipo: TXT
Nome: _resend
Valor: [valor fornecido pelo Resend]

Tipo: CNAME
Nome: resend._domainkey
Valor: [valor fornecido pelo Resend]
```

### Passo 3: Verificar no Resend

1. Volte para https://resend.com/domains
2. Clique em "Verify DNS Records"
3. Aguarde confirmação (pode levar até 48h)

### Passo 4: Obter Token de Produção

1. Vá para https://resend.com/api-keys
2. Crie uma nova API Key
3. Selecione "Full Access" e domínio `storyspark.com.br`
4. Copie o token (começará com `re_live_`)

### Passo 5: Atualizar Configurações

Execute no Supabase SQL Editor:

```sql
-- Atualizar para modo produção
UPDATE vault.secrets 
SET secret = 'seu_token_re_live_aqui'
WHERE name = 'RESEND_API_KEY';

UPDATE vault.secrets 
SET secret = 'production'
WHERE name = 'EMAIL_MODE';
```

## Testando Agora (Modo Dev)

Para testar se está funcionando:

1. Acesse http://localhost:8080
2. Cadastre um email na waitlist
3. Verifique sua caixa de entrada (`paulojack2011@gmail.com`)
4. O email terá o subject: `[DEV - Para: email@cadastrado.com] Confirmação de Cadastro`

## Emails que Funcionam:

### Via Supabase (já funcionando):
- ✅ Confirmação de cadastro (signup)
- ✅ Recuperação de senha
- ✅ Mudança de email

### Via Resend (configurado, aguardando domínio):
- ⏳ Confirmação da waitlist
- ⏳ Convites de acesso
- ⏳ Campanhas de marketing

## Troubleshooting

### Erro: "Domain not verified"
**Solução**: Seu domínio ainda não foi verificado. Use modo development por enquanto.

### Erro: "Rate limit exceeded"
**Solução**: Limite de 100 emails/dia no plano gratuito. Faça upgrade se necessário.

### Emails não chegam
**Verificar**:
1. Spam/Lixeira
2. Logs no Supabase Dashboard > Functions
3. Console do navegador (F12)

## Comandos Úteis

```bash
# Ver logs da Edge Function
npx supabase functions logs send-email

# Testar localmente
curl -X POST https://qgtgvqfikqfjbeixzbyb.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"teste@email.com","subject":"Teste","html":"<p>Teste</p>"}'
```

## Contato e Suporte

- **Resend Dashboard**: https://resend.com
- **Documentação**: https://resend.com/docs
- **Status API**: https://status.resend.com

---

**IMPORTANTE**: Você está recebendo todos os emails em `paulojack2011@gmail.com` porque está em modo desenvolvimento. Isso é normal e esperado! Quando verificar o domínio, mude para modo produção.
