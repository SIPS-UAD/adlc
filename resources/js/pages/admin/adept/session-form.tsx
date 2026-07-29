import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Session { id: number; nama_sesi: string; tanggal_tes: string }

export default function AdeptSessionForm({ session }: { session?: Session }) {
    const isEdit = !!session;
    const { data, setData, post, patch, processing, errors } = useForm({
        nama_sesi: session?.nama_sesi ?? '',
        tanggal_tes: session?.tanggal_tes ?? new Date().toISOString().slice(0, 10),
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        if (isEdit) patch(`/admin/adept/sessions/${session!.id}`);
        else post('/admin/adept/sessions');
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Sesi' : 'Buat Sesi ADEPT'} />
            <div className="p-6 max-w-lg space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/adept/sessions"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Sesi' : 'Buat Sesi ADEPT'}</h1>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Nama Sesi *</Label>
                        <Input placeholder="Contoh: ADEPT Batch 12 - Mei 2025" value={data.nama_sesi} onChange={e => setData('nama_sesi', e.target.value)} />
                        {errors.nama_sesi && <p className="text-destructive text-xs">{errors.nama_sesi}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal Tes *</Label>
                        <Input type="date" value={data.tanggal_tes} onChange={e => setData('tanggal_tes', e.target.value)} />
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Buat Sesi'}</Button>
                </form>
            </div>
        </>
    );
}

