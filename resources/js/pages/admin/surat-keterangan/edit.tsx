import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Record {
    id: number; user_id: number | null; nama_peserta: string; student_id: string;
    nama_kursus: string; tanggal_pengajuan: string; status: string; file_path: string | null;
    supporting_file_path: string | null;
}
interface Applicant { id: number; name: string; student_id: string | null }

export default function SuratKeteranganEdit({ record, applicants }: { record: Record; applicants: Applicant[] }) {
    const { data, setData, patch, processing } = useForm({
        user_id: record.user_id ? String(record.user_id) : '',
        nama_peserta: record.nama_peserta, student_id: record.student_id,
        nama_kursus: record.nama_kursus, tanggal_pengajuan: record.tanggal_pengajuan, status: record.status,
    });
    const { data: uploadData, setData: setUploadData, post: postUpload, processing: uploading, errors: uploadErrors, setError: setUploadError, clearErrors: clearUploadErrors } = useForm({ file: null as File | null });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        patch(`/admin/surat-keterangan/${record.id}`);
    }
    function submitUpload(e: React.SyntheticEvent) {
        e.preventDefault();
        postUpload(`/admin/surat-keterangan/${record.id}/upload`, { forceFormData: true });
    }

    const isPendingOrProcessing = record.status === 'pending' || record.status === 'diproses';
    const pageTitle = isPendingOrProcessing ? 'Proses Pengajuan Surat Keterangan' : 'Detail Pengajuan Surat Keterangan';

    return (
        <>
            <Head title={pageTitle} />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/surat-keterangan"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">{pageTitle}</h1>
                    <StatusBadge value={record.status} />
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Peserta (opsional)</Label>
                        <Select value={data.user_id} onValueChange={v => setData('user_id', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih peserta..." /></SelectTrigger>
                            <SelectContent>{applicants.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.name} — {a.student_id}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Nama Peserta *</Label>
                        <Input value={data.nama_peserta} onChange={e => setData('nama_peserta', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>NIM / NIP *</Label>
                        <Input value={data.student_id} onChange={e => setData('student_id', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Nama Kursus / Pelatihan *</Label>
                        <Input value={data.nama_kursus} onChange={e => setData('nama_kursus', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal Pengajuan *</Label>
                        <Input type="date" value={data.tanggal_pengajuan} onChange={e => setData('tanggal_pengajuan', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={v => setData('status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{['pending','diproses','selesai','ditolak'].map(s => <SelectItem key={s} value={s}><StatusBadge value={s} /></SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                </form>

                {record.supporting_file_path && (
                    <div className="bg-muted/40 p-4 rounded-md border space-y-2">
                        <p className="text-sm font-medium">Berkas Pendukung Pengajuan (dari Peserta):</p>
                        <a
                            href={`/admin/letters/supporting/keterangan/${record.id}/download`}
                            className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-semibold"
                        >
                            <Download className="h-4 w-4" /> Download Berkas Pendukung
                        </a>
                    </div>
                )}

                <Separator />
                <div className="space-y-3">
                    <h2 className="font-medium">Upload Surat PDF</h2>
                    {record.file_path && <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2"><Download className="h-4 w-4" /> File tersedia</p>}
                    <form onSubmit={submitUpload} className="flex gap-4 items-start">
                        <div className="flex flex-col gap-1 w-full max-w-md">
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={e => {
                                    const file = e.target.files?.[0] ?? null;

                                    if (file && file.size > 10 * 1024 * 1024) {
                                        setUploadError('file', 'Ukuran file tidak boleh melebihi 10MB');
                                        setUploadData('file', null);
                                        e.target.value = '';
                                    } else {
                                        clearUploadErrors('file');
                                        setUploadData('file', file);
                                    }
                                }}
                            />
                            <span className="text-[11px] text-muted-foreground">Maksimal ukuran file: 10MB (PDF saja)</span>
                            {uploadErrors.file && <span className="text-destructive text-xs">{uploadErrors.file}</span>}
                        </div>
                        <Button type="submit" disabled={uploading || !uploadData.file} variant="secondary">
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

