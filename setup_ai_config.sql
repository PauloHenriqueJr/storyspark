-- Script para configurar o sistema de IA no StorySpark
-- Execute este script no Supabase SQL Editor

-- Criar tabela admin_llm_settings se não existir
CREATE TABLE IF NOT EXISTS admin_llm_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Configurações gerais
    default_provider TEXT DEFAULT 'gemini',
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    
    -- Configurações de contingência
    contingency_enabled BOOLEAN DEFAULT false,
    fallback_priority JSONB DEFAULT '{"gemini": 1}',
    auto_retry_enabled BOOLEAN DEFAULT true,
    max_retry_attempts INTEGER DEFAULT 3,
    retry_delay_seconds INTEGER DEFAULT 5,
    
    -- OpenAI
    openai_active BOOLEAN DEFAULT false,
    openai_api_key TEXT DEFAULT '',
    openai_model TEXT DEFAULT 'gpt-4o',
    
    -- Anthropic Claude  
    anthropic_active BOOLEAN DEFAULT false,
    anthropic_api_key TEXT DEFAULT '',
    anthropic_model TEXT DEFAULT 'claude-3-5-sonnet-20241022',
    
    -- Google Gemini
    gemini_active BOOLEAN DEFAULT true,
    gemini_api_key TEXT DEFAULT '', -- Deixe vazio para usar simulação
    gemini_model TEXT DEFAULT 'gemini-2.0-flash-exp',
    
    -- OpenRouter
    openrouter_active BOOLEAN DEFAULT false,
    openrouter_api_key TEXT DEFAULT '',
    openrouter_model TEXT DEFAULT 'google/gemini-2.0-flash-exp',
    
    -- Kilocode
    kilocode_active BOOLEAN DEFAULT false,
    kilocode_api_key TEXT DEFAULT '',
    kilocode_model TEXT DEFAULT 'kilocode-model'
);

-- Inserir configuração inicial se não existir
INSERT INTO admin_llm_settings (
    default_provider,
    gemini_active,
    gemini_model,
    temperature,
    max_tokens
)
SELECT 
    'gemini',
    true,
    'gemini-2.0-flash-exp',
    0.7,
    1000
WHERE NOT EXISTS (SELECT 1 FROM admin_llm_settings LIMIT 1);

-- Criar tabela para logs de contingência se não existir
CREATE TABLE IF NOT EXISTS ai_contingency_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    original_provider TEXT NOT NULL,
    fallback_provider TEXT NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    request_id TEXT NOT NULL
);

-- Verificar se a configuração foi criada
SELECT 
    'Configuração inicial criada com sucesso! ✅' as status,
    default_provider,
    gemini_active,
    gemini_model,
    CASE 
        WHEN gemini_api_key = '' OR gemini_api_key IS NULL 
        THEN '⚠️ API Key não configurada (usando simulação)' 
        ELSE '✅ API Key configurada' 
    END as api_key_status
FROM admin_llm_settings 
LIMIT 1;
