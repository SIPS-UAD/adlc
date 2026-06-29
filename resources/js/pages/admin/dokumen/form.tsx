import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';

interface Record { id: number; judul: string; kategori: string }

export default function DokumenForm({ record }: { record?: Record }) {
    const isEdit = !!record;
    const { data, setData, post, patch, processing, errors } = useForm({
        judul: record?.judul ?? '',
        kategori: record?.kategori ?? '',
        file: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            patch(`/admin/dokumen/${record!.id}`, { forceFormData: true } as any);
        } else {
            post('/admin/dokumen', { forceFormData: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Dokumen' : 'Upload Dokumen'} />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/dokumen"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Dokumen' : 'Upload Dokumen'}</h1>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Judul *</Label>
                        <Input value={data.judul} onChange={e => setData('judul', e.target.value)} />
                        {errors.judul && <p className="text-destructive text-xs">{errors.judul}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Kategori *</Label>
                        <Select value={data.kategori} onValueChange={v => setData('kategori', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                            <SelectContent>
                                {['sop','aturan','sk','lainnya'].map(k => <SelectItem key={k} value={k}><StatusBadge value={k} /></SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.kategori && <p className="text-destructive text-xs">{errors.kategori}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>{isEdit ? 'Ganti File (opsional)' : 'File *'}</Label>
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={e => setData('file', e.target.files?.[0] ?? null)} />
                        {errors.file && <p className="text-destructive text-xs">{errors.file}</p>}
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Upload'}</Button>
                </form>
            </div>
        </>
    );
}
