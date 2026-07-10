import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Record {
    id: number; jenis: string; kategori: string; deskripsi: string; jumlah: number; tanggal: string;
}
interface Summary { pemasukan: number; pengeluaran: number; saldo: number }
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { jenis?: string; from?: string; to?: string };
    summary: Summary;
}

function formatRupiah(v: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
}

export default function KeuanganIndex({ records, filters, summary }: Props) {
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');

    function applyFilter() {
        router.get('/admin/keuangan', { jenis: filters.jenis, from: from || undefined, to: to || undefined }, { preserveState: true });
    }
    function setJenis(value: string) {
        router.get('/admin/keuangan', { jenis: value === 'all' ? undefined : value, from, to }, { preserveState: true });
    }
    function confirmDelete(id: number) {
        if (confirm('Hapus transaksi ini?')) router.delete(`/admin/keuangan/${id}`);
    }

    return (
        <>
            <Head title="Keuangan" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Keuangan</h1>
                    <Link href="/admin/keuangan/create"><Button><PlusCircle className="mr-2 h-4 w-4" /> Tambah Transaksi</Button></Link>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Total Pemasukan</CardTitle></CardHeader>
                        <CardContent><p className="text-xl font-bold text-green-600">{formatRupiah(summary.pemasukan)}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Total Pengeluaran</CardTitle></CardHeader>
                        <CardContent><p className="text-xl font-bold text-red-600">{formatRupiah(summary.pengeluaran)}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Saldo</CardTitle></CardHeader>
                        <CardContent><p className={`text-xl font-bold ${summary.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatRupiah(summary.saldo)}</p></CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap items-end">
                    <Select value={filters.jenis ?? 'all'} onValueChange={setJenis}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Semua Jenis" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="pemasukan"><StatusBadge value="pemasukan" /></SelectItem>
                            <SelectItem value="pengeluaran"><StatusBadge value="pengeluaran" /></SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2 items-center">
                        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-40" />
                        <span className="text-muted-foreground">–</span>
                        <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-40" />
                        <Button onClick={applyFilter} variant="outline">Filter</Button>
                    </div>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                <th className="px-4 py-3 text-left font-medium">Jenis</th>
                                <th className="px-4 py-3 text-left font-medium">Kategori</th>
                                <th className="px-4 py-3 text-left font-medium">Deskripsi</th>
                                <th className="px-4 py-3 text-right font-medium">Jumlah</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {records.data.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Tidak ada transaksi.</td></tr>}
                            {records.data.map(r => (
                                <tr key={r.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">{r.tanggal}</td>
                                    <td className="px-4 py-3"><StatusBadge value={r.jenis} /></td>
                                    <td className="px-4 py-3">{r.kategori}</td>
                                    <td className="px-4 py-3 max-w-xs truncate">{r.deskripsi}</td>
                                    <td className={`px-4 py-3 text-right font-medium ${r.jenis === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatRupiah(r.jumlah)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/keuangan/${r.id}/edit`}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
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
