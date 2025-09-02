
-- Inserir listas de email de exemplo
INSERT INTO email_lists (id, name, description, workspace_id, user_id, status, subscribers_count, growth_rate, double_opt_in, auto_responder, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'Newsletter Geral', 'Lista principal para newsletter mensal', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'active', 1250, 8.2, true, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440011', 'Clientes Premium', 'Lista exclusiva para clientes premium', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'active', 350, 5.8, true, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440012', 'Novos Usuários', 'Sequência de boas-vindas para novos usuários', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'active', 890, 12.4, true, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440013', 'Promoções', 'Lista para ofertas especiais e promoções', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'inactive', 0, 0, false, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns contatos de exemplo
INSERT INTO email_contacts (id, email, first_name, last_name, status, workspace_id, source, subscribed_at, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', 'joao@exemplo.com', 'João', 'Silva', 'subscribed', '550e8400-e29b-41d4-a716-446655440000', 'website', NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440021', 'maria@exemplo.com', 'Maria', 'Santos', 'subscribed', '550e8400-e29b-41d4-a716-446655440000', 'facebook', NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440022', 'pedro@exemplo.com', 'Pedro', 'Oliveira', 'subscribed', '550e8400-e29b-41d4-a716-446655440000', 'google', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Relacionar contatos com listas
INSERT INTO email_list_contacts (id, list_id, contact_id, added_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', NOW()),
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', NOW()),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440020', NOW()),
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440022', NOW())
ON CONFLICT (id) DO NOTHING;

