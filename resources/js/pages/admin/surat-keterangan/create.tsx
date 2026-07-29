import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Applicant { id: number; name: string; student_id: string | null }

export default function SuratKeteranganCreate({ applicants }: { applicants: Applicant[] }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '', nama_peserta: '', student_id: '', nama_kursus: '',
        tanggal_pengajuan: new Date().toISOString().slice(0, 10),
    });

    function handleApplicantChange(value: string) {
        const found = applicants.find(a => String(a.id) === value);
        setData(prev => ({ ...prev, user_id: value, nama_peserta: found?.name ?? '', student_id: found?.student_id ?? '' }));
    }

    function submit(e: React.SyntheticEvent) { e.preventDefault(); post('/admin/surat-keterangan'); }

    return (
        <>
            <Head title="Tambah Surat Keterangan" />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/surat-keterangan"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Tambah Surat Keterangan</h1>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Peserta (opsional)</Label>
                        <Select value={data.user_id} onValueChange={handleApplicantChange}>
                            <SelectTrigger><SelectValue placeholder="Pilih peserta..." /></SelectTrigger>
                            <SelectContent>{applicants.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.name} — {a.student_id}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Nama Peserta *</Label>
                        <Input value={data.nama_peserta} onChange={e => setData('nama_peserta', e.target.value)} />
                        {errors.nama_peserta && <p className="text-destructive text-xs">{errors.nama_peserta}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>NIM / NIP *</Label>
                        <Input value={data.student_id} onChange={e => setData('student_id', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Nama Kursus / Pelatihan *</Label>
                        <Input value={data.nama_kursus} onChange={e => setData('nama_kursus', e.target.value)} />
                        {errors.nama_kursus && <p className="text-destructive text-xs">{errors.nama_kursus}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal Pengajuan *</Label>
                        <Input type="date" value={data.tanggal_pengajuan} onChange={e => setData('tanggal_pengajuan', e.target.value)} />
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                </form>
            </div>
        </>
    );
}

