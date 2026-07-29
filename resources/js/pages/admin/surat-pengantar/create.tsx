import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Applicant { id: number; name: string; student_id: string | null }

export default function SuratPengantarCreate({ applicants }: { applicants: Applicant[] }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nama_pemohon: '',
        student_id: '',
        keperluan: '',
        tanggal_pengajuan: new Date().toISOString().slice(0, 10),
    });

    function handleApplicantChange(value: string) {
        setData('user_id', value);
        if (value) {
            const found = applicants.find(a => String(a.id) === value);
            if (found) {
                setData(prev => ({ ...prev, user_id: value, nama_pemohon: found.name, student_id: found.student_id ?? '' }));
            }
        }
    }

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post('/admin/surat-pengantar');
    }

    return (
        <>
            <Head title="Tambah Surat Pengantar" />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/surat-pengantar"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Tambah Surat Pengantar</h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Peserta (opsional)</Label>
                        <Select value={data.user_id} onValueChange={handleApplicantChange}>
                            <SelectTrigger><SelectValue placeholder="Pilih peserta..." /></SelectTrigger>
                            <SelectContent>
                                {applicants.map(a => (
                                    <SelectItem key={a.id} value={String(a.id)}>{a.name} — {a.student_id}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>Nama Pemohon *</Label>
                        <Input value={data.nama_pemohon} onChange={e => setData('nama_pemohon', e.target.value)} />
                        {errors.nama_pemohon && <p className="text-destructive text-xs">{errors.nama_pemohon}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>NIM / NIP *</Label>
                        <Input value={data.student_id} onChange={e => setData('student_id', e.target.value)} />
                        {errors.student_id && <p className="text-destructive text-xs">{errors.student_id}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Keperluan *</Label>
                        <Textarea rows={4} value={data.keperluan} onChange={e => setData('keperluan', e.target.value)} />
                        {errors.keperluan && <p className="text-destructive text-xs">{errors.keperluan}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Tanggal Pengajuan *</Label>
                        <Input type="date" value={data.tanggal_pengajuan} onChange={e => setData('tanggal_pengajuan', e.target.value)} />
                        {errors.tanggal_pengajuan && <p className="text-destructive text-xs">{errors.tanggal_pengajuan}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                </form>
            </div>
        </>
    );
}

