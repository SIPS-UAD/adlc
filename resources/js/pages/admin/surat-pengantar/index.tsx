import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Search, Pencil, Trash2, Download, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Record {
    id: number;
    nama_pemohon: string;
    student_id: string;
    keperluan: string;
    tanggal_pengajuan: string;
    status: string;
    file_path: string | null;
    supporting_file_path: string | null;
}

interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { search?: string; status?: string };
}

export default function SuratPengantarIndex({ records, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applySearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/surat-pengantar', { search, status: filters.status }, { preserveState: true });
    }

    function setStatus(value: string) {
        router.get('/admin/surat-pengantar', { search, status: value === 'all' ? undefined : value }, { preserveState: true });
    }

    function confirmDelete(id: number) {
        if (confirm('Hapus surat pengantar ini?')) {
            router.delete(`/admin/surat-pengantar/${id}`);
        }
    }

    return (
        <>
            <Head title="Surat Pengantar" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Surat Pengantar Kaprodi</h1>
                    <Link href="/admin/surat-pengantar/create">
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Tambah Surat</Button>
                    </Link>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <form onSubmit={applySearch} className="flex gap-2">
                        <Input
                            placeholder="Cari nama / NIM..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-64"
                        />
                        <Button type="submit" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </form>
                    <Select value={filters.status ?? 'all'} onValueChange={setStatus}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="diproses">Diproses</SelectItem>
                            <SelectItem value="selesai">Selesai</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nama</th>
                                <th className="px-4 py-3 text-left font-medium">NIM</th>
                                <th className="px-4 py-3 text-left font-medium">Keperluan</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Berkas</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {records.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data.</td></tr>
                            )}
                            {records.data.map(r => (
                                <tr key={r.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{r.nama_pemohon}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.student_id}</td>
                                    <td className="px-4 py-3 max-w-xs truncate">{r.keperluan}</td>
                                    <td className="px-4 py-3">{r.tanggal_pengajuan}</td>
                                    <td className="px-4 py-3"><StatusBadge value={r.status} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 items-center">
                                            {r.supporting_file_path && (
                                                <a
                                                    href={`/admin/letters/supporting/pengantar/${r.id}/download`}
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
                                                    <Download className="h-3.5 w-3.5" /> TTD
                                                </a>
                                            )}
                                            {!r.supporting_file_path && !r.file_path && <span className="text-muted-foreground text-xs">-</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/surat-pengantar/${r.id}/edit`}>
                                                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(r.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-1 flex-wrap">
                    {records.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span key={i} className="px-3 py-1 rounded border text-sm text-muted-foreground opacity-50"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            </div>
        </>
    );
}
