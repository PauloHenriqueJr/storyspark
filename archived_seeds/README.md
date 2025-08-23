# Arquivos de Seed Arquivados

Este diretório contém os arquivos de seed originais que foram substituídos pelo uso direto do MCP Supabase.

## Arquivos Arquivados:
- `complete_seed_insertion.js` - Script original de inserção de seeds
- `create_stats_tables.sql` - SQL para criação de tabelas de estatísticas  
- `RESUMO_EXECUTIVO.md` - Documentação do projeto de migração
- `MAPEAMENTO_SEED_ADMIN.md` - Mapeamento de dados mockados

## Motivo do Arquivamento:
Os arquivos de seed foram arquivados pois agora utilizamos o MCP Supabase diretamente para:
- Inserção mais confiável de dados
- Melhor controle de erros
- Integração direta com o banco
- Atualizações dinâmicas baseadas no estado atual do banco

## Status Atual:
✅ Dados inseridos via MCP:
- 5 Brand Voices com métricas reais
- 3 Campanhas com estatísticas de performance  
- 2 Target Personas detalhadas
- Tabelas de estatísticas criadas e populadas

## Próximos Passos:
- Migração automática baseada no estado atual do banco
- Identificação e migração de dados mockados restantes