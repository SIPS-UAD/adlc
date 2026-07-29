import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/status-badge';

interface Record { id: number; jenis: string; kategori: string; deskripsi: string; jumlah: number; tanggal: string }

export default function KeuanganForm({ record }: { record?: Record }) {
    const isEdit = !!record;
    const { data, setData, post, patch, processing, errors } = useForm({
        jenis: record?.jenis ?? 'pemasukan',
        kategori: record?.kategori ?? '',
        deskripsi: record?.deskripsi ?? '',
        jumlah: record?.jumlah ? String(record.jumlah) : '',
        tanggal: record?.tanggal ?? new Date().toISOString().slice(0, 10),
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        if (isEdit) patch(`/admin/keuangan/${record!.id}`);
        else post('/admin/keuangan');
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'} />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/keuangan"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}</h1>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Jenis *</Label>
                        <Select value={data.jenis} onValueChange={v => setData('jenis', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pemasukan"><StatusBadge value="pemasukan" /></SelectItem>
                                <SelectItem value="pengeluaran"><StatusBadge value="pengeluaran" /></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Kategori *</Label>
                        <Input placeholder="Contoh: Biaya Kursus, ATK, ..." value={data.kategori} onChange={e => setData('kategori', e.target.value)} />
                        {errors.kategori && <p className="text-destructive text-xs">{errors.kategori}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Deskripsi *</Label>
                        <Textarea rows={3} value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} />
                        {errors.deskripsi && <p className="text-destructive text-xs">{errors.deskripsi}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Jumlah (IDR) *</Label>
                        <Input type="number" min="0" step="1000" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)} />
                        {errors.jumlah && <p className="text-destructive text-xs">{errors.jumlah}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal *</Label>
                        <Input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} />
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah'}</Button>
                </form>
            </div>
        </>
    );
}

