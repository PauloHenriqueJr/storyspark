import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filePath } = await req.json()

    if (!filePath) {
      throw new Error('filePath is required')
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    // Decode file content
    const text = new TextDecoder().decode(fileData)

    // Call Gemini API for analysis
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not set')
    }

    const prompt = `Analise este documento de empresa e extraia as seguintes informações em formato JSON válido:

{
  "brand_voices": [
    {
      "name": "Nome da Brand Voice",
      "description": "Descrição",
      "tone": "Tom (ex: amigável, profissional)",
      "style": "Estilo (ex: conversacional, formal)",
      "examples": ["exemplo1", "exemplo2"],
      "guidelines": "Diretrizes principais"
    }
  ],
  "personas": [
    {
      "name": "Nome da Persona",
      "description": "Descrição completa",
      "age_range": "Faixa etária",
      "location": "Localização",
      "occupation": "Ocupação",
      "goals": ["meta1", "meta2"],
      "pain_points": ["dor1", "dor2"],
      "interests": ["interesse1", "interesse2"]
    }
  ],
  "company_info": {
    "name": "Nome da empresa",
    "industry": "Setor",
    "target_audience": "Público alvo geral",
    "key_products_services": ["produto1", "serviço1"],
    "unique_value_prop": "Proposta de valor única"
  }
}

Documento:
${text}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const result = await response.json()
    const generatedText = result.candidates[0].content.parts[0].text

    // Clean up JSON from Gemini response (remove markdown formatting)
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response')
    }

    const extractedData = JSON.parse(jsonMatch[0])

    // Insert extracted data into database
    const { data: user } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''))

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.user.id)
      .single()

    if (!workspace) {
      throw new Error('No workspace found')
    }

    const inserts = []

    // Insert brand voices
    if (extractedData.brand_voices && extractedData.brand_voices.length > 0) {
      const brandVoices = extractedData.brand_voices.map(bv => ({
        ...bv,
        workspace_id: workspace.id,
        user_id: user.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0,
        is_active: true
      }))
      inserts.push(supabase.from('brand_voices').insert(brandVoices))
    }

    // Insert personas
    if (extractedData.personas && extractedData.personas.length > 0) {
      const personas = extractedData.personas.map(p => ({
        ...p,
        workspace_id: workspace.id,
        user_id: user.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0
      }))
      inserts.push(supabase.from('personas').insert(personas))
    }

    // Save company info (perhaps in a company_profiles table or user profile)
    if (extractedData.company_info) {
      inserts.push(supabase.from('user_profiles').upsert({
        user_id: user.user.id,
        company_name: extractedData.company_info.name,
        industry: extractedData.company_info.industry,
        target_audience: extractedData.company_info.target_audience,
        key_products_services: extractedData.company_info.key_products_services,
        unique_value_prop: extractedData.company_info.unique_value_prop,
        updated_at: new Date().toISOString()
      }))
    }

    // Execute all inserts
    const results = await Promise.all(inserts)
    results.forEach((r, i) => {
      if (r.error) {
        console.error(`Error in insert ${i}:`, r.error)
      }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData,
        message: 'Document analyzed and data extracted successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Error in document analyzer:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})