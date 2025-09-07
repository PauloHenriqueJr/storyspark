# 📧 Sistema de Email do StorySpark

## Status: ✅ Operacional

### Configuração Atual

O sistema de email está totalmente configurado e operacional com as seguintes características:

#### 🔧 Tecnologias
- **Provedor**: Resend
- **Templates**: Armazenados no Supabase
- **Edge Function**: `/functions/v1/send-email`
- **Admin UI**: `/admin/email-templates`

#### 📋 Templates Disponíveis
1. **Confirmação da Waitlist** - Bem-vindo à lista de espera
2. **Convite Waitlist** - Acesso liberado à plataforma
3. **E-mail de Boas-vindas** - Onboarding de novos usuários
4. **Newsletter Promocional** - Campanhas de marketing
5. **Confirmação de Pedido** - Emails transacionais
6. **Convite para Equipe** - Colaboração entre usuários

### Como Usar

#### 1. Enviar Email com Template

```typescript
import { emailService } from '@/services/emailService';

// Enviar email usando template do banco
await emailService.sendEmail({
  to: [{ email: 'usuario@exemplo.com', name: 'Nome do Usuário' }],
  template: 'Confirmação da Waitlist',
  variables: {
    userName: 'João Silva',
    waitlistPosition: 42,
    selectedIdeas: ['Ideia 1', 'Ideia 2']
  }
});
```

#### 2. Gerenciar Templates

Acesse `/admin/email-templates` para:
- Criar novos templates
- Editar templates existentes
- Visualizar preview dos emails
- Testar envio

#### 3. Variáveis de Ambiente

```env
# Resend
VITE_RESEND_API_KEY=sua_chave_resend
VITE_EMAIL_MODE=production # ou development
VITE_TEST_EMAIL=email@teste.com # usado em modo development
VITE_EMAIL_FROM=suporte@storyspark.com.br
VITE_EMAIL_FROM_NAME=StorySpark
```

### Modo de Operação

#### Modo Development
- Todos os emails são redirecionados para `VITE_TEST_EMAIL`
- O assunto inclui `[DEV - Para: email_original]`
- Ideal para testes sem enviar emails reais

#### Modo Production
- Emails são enviados para os destinatários reais
- Usar com cuidado em ambiente de produção

### Integração com Waitlist

O sistema está integrado com o fluxo de waitlist:

```typescript
// services/waitlistService.ts
async function addToWaitlist(data) {
  // 1. Salva no banco
  const signup = await saveToDatabase(data);
  
  // 2. Envia email de confirmação
  await emailService.sendEmail({
    template: 'Confirmação da Waitlist',
    to: [{ email: data.email }],
    variables: {
      userName: data.name,
      selectedIdeas: data.selectedIdeas,
      waitlistPosition: signup.position
    }
  });
}
```

### Analytics e Métricas

O sistema registra:
- ✅ Emails enviados com sucesso
- ⚠️ Falhas de envio
- 📊 Taxa de abertura (quando configurado)
- 🔗 Cliques em links (quando configurado)

### Troubleshooting

#### Email não está sendo enviado
1. Verifique se `VITE_RESEND_API_KEY` está configurada
2. Confirme que a Edge Function está deployed
3. Verifique os logs: `supabase functions logs send-email`

#### Template não encontrado
1. Confirme que o template existe no banco
2. Use o nome exato do template (case sensitive)
3. Verifique permissões de leitura na tabela `email_templates`

#### Emails indo para spam
1. Configure SPF/DKIM no domínio
2. Use um domínio verificado no Resend
3. Evite palavras que trigam filtros de spam

### Custos

#### Resend
- **Free**: 3.000 emails/mês
- **Pro**: $20/mês para 50.000 emails
- **Scale**: Personalizado para volumes maiores

### Roadmap

- [ ] Implementar tracking de abertura
- [ ] Adicionar analytics detalhados
- [ ] A/B testing de templates
- [ ] Automação de campanhas
- [ ] Integração com CRM

### Suporte

Para problemas ou dúvidas:
1. Verifique esta documentação
2. Consulte os logs no Supabase
3. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: Janeiro 2025
**Status**: ✅ Sistema operacional e testado
