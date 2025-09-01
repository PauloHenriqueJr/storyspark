interface EmailRequest {
  to: string
  subject: string
  html: string
  from?: string
  fromName?: string
}

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
  details?: any
}

// Configurações de CORS incorporadas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Tratar requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    // Verificar se é uma requisição POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Obter dados da requisição
    const requestData = await req.json()
    
    // Extrair dados considerando diferentes formatos (Mailtrap vs Resend)
    let to: string
    let subject: string
    let html: string
    let from: string | undefined
    let fromName: string | undefined
    
    if (requestData.from && typeof requestData.from === 'object') {
      // Formato Mailtrap: { from: { email: string, name: string }, to: [{ email: string }] }
      to = Array.isArray(requestData.to) ? requestData.to[0]?.email : requestData.to
      subject = requestData.subject
      html = requestData.html
      from = requestData.from.email
      fromName = requestData.from.name
    } else {
      // Formato Resend: { from: string, fromName: string, to: string }
      to = requestData.to
      subject = requestData.subject
      html = requestData.html
      from = requestData.from
      fromName = requestData.fromName
    }

    // Validar campos obrigatórios
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ 
          error: 'Campos obrigatórios: to, subject, html',
          success: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Obter token do Resend das variáveis de ambiente
    const resendToken = Deno.env.get('RESEND_API_KEY')
    if (!resendToken) {
      console.error('RESEND_API_KEY não configurado')
      return new Response(
        JSON.stringify({ 
          error: 'Configuração de e-mail não encontrada',
          success: false
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Configurar domínio do remetente
    const fromDomain = Deno.env.get('RESEND_FROM_DOMAIN') || 'resend.dev'
    const defaultFromEmail = `suporte@${fromDomain}`
    const fromEmail = from || defaultFromEmail
    const senderName = fromName || 'StorySpark'
    
    // Log para depuração do domínio
    console.log('From domain configurado:', fromDomain)
    console.log('From email configurado:', fromEmail)
    console.log('Sender name:', senderName)
    console.log('RESEND_FROM_DOMAIN env:', Deno.env.get('RESEND_FROM_DOMAIN'))

    // Preparar dados do e-mail para o Resend
    // Verificar se o fromEmail já está no formato correto
    let formattedFrom: string
    if (fromEmail.includes('@') && !fromEmail.includes('<')) {
      // E-mail simples, adicionar nome se fornecido e válido
      if (senderName && senderName.trim() !== '') {
        formattedFrom = `${senderName.trim()} <${fromEmail}>`
      } else {
        formattedFrom = fromEmail
      }
    } else {
      // Já está formatado ou é inválido, usar como está
      formattedFrom = fromEmail
    }
    
    // Validar formato final do e-mail
    const emailRegex = /^[^\s<>]+@[^\s<>]+\.[^\s<>]+$/
    const namedEmailRegex = /^.+\s<[^\s<>]+@[^\s<>]+\.[^\s<>]+>$/
    
    if (!emailRegex.test(formattedFrom) && !namedEmailRegex.test(formattedFrom)) {
      console.error('Formato de e-mail inválido:', formattedFrom)
      return new Response(
        JSON.stringify({ 
          error: 'Formato de e-mail do remetente inválido',
          details: { invalidFrom: formattedFrom },
          success: false
        }),
        {
          status: 422,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const emailData = {
      from: formattedFrom,
      to: [to],
      subject: subject,
      html: html
    }

    // Log para depuração
    console.log('Token Resend configurado:', resendToken ? 'Sim' : 'Não')
    console.log('Dados do e-mail:', JSON.stringify(emailData, null, 2))
    
    // Usar a API do Resend
    const apiUrl = 'https://api.resend.com/emails'
    
    console.log('Usando endpoint:', apiUrl)
    console.log('Serviço: Resend')
    
    const resendResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    const responseData = await resendResponse.json()
    console.log('Resposta do Resend:', JSON.stringify(responseData, null, 2))

    if (resendResponse.ok) {
      const response: any = {
        success: true,
        messageId: responseData.id || 'sent',
        message: 'E-mail enviado com sucesso'
      }
      
      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Erro do Resend:', responseData)
      return new Response(
        JSON.stringify({
          error: 'Erro ao enviar e-mail',
          details: responseData,
          success: false
        }),
        {
          status: resendResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Erro na Edge Function:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        details: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})