-- Script de teste para verificar conexão
SELECT 
    p.email, 
    p.role,
    w.id as workspace_id, 
    w.name as workspace_name,
    COUNT(bv.id) as brand_voices_count,
    COUNT(tp.id) as personas_count,
    COUNT(c.id) as campaigns_count
FROM profiles p 
LEFT JOIN workspaces w ON p.id = w.owner_id 
LEFT JOIN brand_voices bv ON w.id = bv.workspace_id
LEFT JOIN target_personas tp ON w.id = tp.workspace_id
LEFT JOIN campaigns c ON w.id = c.workspace_id
WHERE p.email = 'paulojack2011@gmail.com'
GROUP BY p.email, p.role, w.id, w.name;