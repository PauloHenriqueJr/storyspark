import React, { useEffect, useMemo, useState } from 'react';
import { copiesService, type CopyRecord } from '@/services/copiesService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Download, Filter, History, Search } from 'lucide-react';

const PAGE_SIZE = 20;

export const CopiesHistory: React.FC = () => {
    const [items, setItems] = useState<CopyRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [platform, setPlatform] = useState<string | undefined>();
    const [copyType, setCopyType] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

    const load = async () => {
        setLoading(true);
        try {
            const { items, total } = await copiesService.list({ page, pageSize: PAGE_SIZE, platform, copy_type: copyType, q });
            setItems(items);
            setTotal(total);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, platform, copyType]);

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        load();
    };

    const exportCSV = () => {
        const headers = ['created_at', 'platform', 'copy_type', 'title', 'content', 'tokens_input', 'tokens_output', 'cost_usd'];
        const rows = items.map(i => [
            i.created_at,
            i.platform ?? '',
            i.copy_type ?? '',
            (i.title ?? '').replace(/\n/g, ' ').replace(/"/g, '""'),
            (i.content ?? '').replace(/\n/g, ' ').replace(/"/g, '""'),
            i.tokens_input ?? '',
            i.tokens_output ?? '',
            i.cost_usd ?? ''
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v)}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `copies_export_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <History className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Histórico de Copies</h1>
                    <p className="text-sm text-muted-foreground">Busque, filtre e exporte as copies já geradas pela IA.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Pesquisar e Filtrar</CardTitle>
                    <CardDescription>Use busca por texto e filtros de plataforma/tipo para encontrar rapidamente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título ou conteúdo..." className="pl-9" />
                        </div>
                        <Select value={platform ?? 'all'} onValueChange={(v) => setPlatform(v === 'all' ? undefined : v)}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Plataforma" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={copyType ?? 'all'} onValueChange={(v) => setCopyType(v === 'all' ? undefined : v)}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="ad">Anúncio</SelectItem>
                                <SelectItem value="post">Post</SelectItem>
                                <SelectItem value="subject">Assunto</SelectItem>
                                <SelectItem value="caption">Legenda</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={loading}><Filter className="w-4 h-4 mr-2" />Filtrar</Button>
                        <Button type="button" variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />Exportar</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Plataforma</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Título</TableHead>
                                <TableHead>Tokens</TableHead>
                                <TableHead>Custo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((i) => (
                                <TableRow key={i.id}>
                                    <TableCell className="whitespace-nowrap">{new Date(i.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="capitalize">{i.platform || '-'}</TableCell>
                                    <TableCell className="capitalize">{i.copy_type || '-'}</TableCell>
                                    <TableCell className="max-w-[420px] truncate" title={i.title || i.content.slice(0, 160)}>
                                        {i.title || i.content.slice(0, 80)}
                                    </TableCell>
                                    <TableCell>{(i.tokens_input ?? 0) + (i.tokens_output ?? 0)}</TableCell>
                                    <TableCell>{i.cost_usd ? `$${i.cost_usd.toFixed(4)}` : '-'}</TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum resultado</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Página {page} de {totalPages} • {total} registros</div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default CopiesHistory;
