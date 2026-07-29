import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Record { id: number; judul: string; kategori: string; visibility?: string }

export default function DokumenForm({ record }: { record?: Record }) {
    const isEdit = !!record;
    const { data, setData, post, patch, processing, errors, setError, clearErrors } = useForm({
        judul: record?.judul ?? '',
        kategori: record?.kategori ?? '',
        visibility: record?.visibility ?? 'public',
        file: null as File | null,
    });

    useEffect(() => {
        setData({
            judul: record?.judul ?? '',
            kategori: record?.kategori ?? '',
            visibility: record?.visibility ?? 'public',
            file: null,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record?.id]);

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
                        <Label>Visibilitas *</Label>
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={data.visibility === 'public'}
                                    onChange={() => setData('visibility', 'public')}
                                    className="h-4 w-4 accent-primary"
                                />
                                <span>Publik</span>
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={data.visibility === 'private'}
                                    onChange={() => setData('visibility', 'private')}
                                    className="h-4 w-4 accent-primary"
                                />
                                <span>Privat</span>
                            </label>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Publik: dapat dilihat dan diunduh oleh admin dan applicant. Privat: hanya admin yang dapat melihat.
                        </p>
                        {errors.visibility && <p className="text-destructive text-xs">{errors.visibility}</p>}
                    </div>
                    <div className="space-y-1 flex flex-col gap-1">
                        <Label>{isEdit ? 'Ganti File (opsional)' : 'File *'}</Label>
                        <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={e => {
                                const file = e.target.files?.[0] ?? null;

                                if (file && file.size > 10 * 1024 * 1024) {
                                    setError('file', 'Ukuran file tidak boleh melebihi 10MB');
                                    setData('file', null);
                                    e.target.value = '';
                                } else {
                                    clearErrors('file');
                                    setData('file', file);
                                }
                            }}
                        />
                        <span className="text-[11px] text-muted-foreground">Maksimal ukuran file: 10MB (PDF, DOC, DOCX saja)</span>
                        {errors.file && <p className="text-destructive text-xs">{errors.file}</p>}
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Upload'}</Button>
                </form>
            </div>
        </>
    );
}
