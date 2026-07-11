import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2, Download } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Record { id: number; judul: string; kategori: string; visibility: string; file_path: string; created_at: string }
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { kategori?: string };
}

export default function DokumenIndex({ records, filters }: Props) {
    function setKategori(value: string) {
        router.get('/admin/dokumen', { kategori: value === 'all' ? undefined : value }, { preserveState: true });
    }
    function confirmDelete(id: number) {
        if (confirm('Hapus dokumen ini?')) router.delete(`/admin/dokumen/${id}`);
    }

    return (
        <>
            <Head title="Dokumen" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Repositori Dokumen</h1>
                    <Link href="/admin/dokumen/create"><Button><PlusCircle className="mr-2 h-4 w-4" /> Upload Dokumen</Button></Link>
                </div>
                <Select value={filters.kategori ?? 'all'} onValueChange={setKategori}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        {['sop','aturan','sk','lainnya'].map(k => <SelectItem key={k} value={k}><StatusBadge value={k} /></SelectItem>)}
                    </SelectContent>
                </Select>
                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Judul</th>
                                <th className="px-4 py-3 text-left font-medium">Kategori</th>
                                <th className="px-4 py-3 text-left font-medium">Visibilitas</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Upload</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {records.data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Tidak ada dokumen.</td></tr>}
                            {records.data.map(r => (
                                <tr key={r.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{r.judul}</td>
                                    <td className="px-4 py-3"><StatusBadge value={r.kategori} /></td>
                                    <td className="px-4 py-3"><StatusBadge value={r.visibility} /></td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.created_at.slice(0,10)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <a href={`/storage/${r.file_path}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                            </a>
                                            <Link href={`/admin/dokumen/${r.id}/edit`}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
