import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Search, Trash2, Download, Paperclip, RotateCcw, CheckSquare, Pencil } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Record {
    id: number; nama_peserta: string; student_id: string; nama_kursus: string;
    tanggal_pengajuan: string; status: string; file_path: string | null;
    supporting_file_path: string | null;
}
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { search?: string; status?: string };
}

export default function SuratKeteranganIndex({ records, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');

    function applySearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/surat-keterangan', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
        }, { preserveState: true });
    }

    function handleReset() {
        setSearch('');
        setStatus('all');
        router.get('/admin/surat-keterangan', {}, { preserveState: true });
    }

    function confirmDelete(id: number) {
        if (confirm('Hapus surat keterangan ini?')) {
            router.delete(`/admin/surat-keterangan/${id}`);
        }
    }

    return (
        <>
            <Head title="Surat Keterangan" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Surat Keterangan Kursus / Pelatihan</h1>
                    <Link href="/admin/surat-keterangan/create"><Button><PlusCircle className="mr-2 h-4 w-4" /> Tambah</Button></Link>
                </div>

                <div className="bg-card border rounded-lg p-5 space-y-4 shadow-xs">
                    <form onSubmit={applySearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="search">Kata Kunci / Pencarian</Label>
                                <Input
                                    id="search"
                                    placeholder="Cari nama, NIM, atau kursus..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status Pengajuan</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="diproses">Diproses</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" size="sm" className="gap-1.5 font-semibold">
                                <Search className="h-4 w-4" /> Cari
                            </Button>
                            <Button type="button" variant="destructive" size="sm" onClick={handleReset} className="gap-1.5 font-semibold">
                                <RotateCcw className="h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nama Peserta</th>
                                <th className="px-4 py-3 text-left font-medium">NIM</th>
                                <th className="px-4 py-3 text-left font-medium">Nama Kursus</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Berkas</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {records.data.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data.</td></tr>}
                            {records.data.map(r => (
                                <tr key={r.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{r.nama_peserta}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.student_id}</td>
                                    <td className="px-4 py-3">{r.nama_kursus}</td>
                                    <td className="px-4 py-3">{r.tanggal_pengajuan}</td>
                                    <td className="px-4 py-3"><StatusBadge value={r.status} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 items-center">
                                            {r.supporting_file_path && (
                                                <a
                                                    href={`/admin/letters/supporting/keterangan/${r.id}/download`}
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                    title="Unduh Berkas Pendukung"
                                                >
                                                    <Paperclip className="h-3.5 w-3.5" /> Pendukung
                                                </a>
                                            )}
                                            {r.file_path && (
                                                <a
                                                    href={`/storage/${r.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
                                                    title="Unduh Surat Selesai"
                                                >
                                                    <Download className="h-3.5 w-3.5" /> File
                                                </a>
                                            )}
                                            {!r.supporting_file_path && !r.file_path && <span className="text-muted-foreground text-xs">-</span>}
                                        </div>
                                    </td>
                                     <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/admin/surat-keterangan/${r.id}/edit`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary hover:bg-primary/10"
                                                    title={r.status === 'pending' || r.status === 'diproses' ? 'Proses Pengajuan' : 'Detail Pengajuan'}
                                                >
                                                    <CheckSquare className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/surat-keterangan/${r.id}/edit`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                                    title="Edit Data"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(r.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Hapus">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex gap-1 flex-wrap">
                    {records.links.map((link, i) => (
                        link.url
                            ? <Link key={i} href={link.url} className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            : <span key={i} className="px-3 py-1 rounded border text-sm text-muted-foreground opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            </div>
        </>
    );
}
