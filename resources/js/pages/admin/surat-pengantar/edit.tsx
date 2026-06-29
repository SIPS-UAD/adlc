import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { useRef } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface Record {
    id: number; user_id: number | null; nama_pemohon: string; student_id: string;
    keperluan: string; tanggal_pengajuan: string; status: string; file_path: string | null;
    supporting_file_path: string | null;
}
interface Applicant { id: number; name: string; student_id: string | null }

export default function SuratPengantarEdit({ record, applicants }: { record: Record; applicants: Applicant[] }) {
    const { data, setData, patch, processing, errors } = useForm({
        user_id: record.user_id ? String(record.user_id) : '',
        nama_pemohon: record.nama_pemohon,
        student_id: record.student_id,
        keperluan: record.keperluan,
        tanggal_pengajuan: record.tanggal_pengajuan,
        status: record.status,
    });

    const fileRef = useRef<HTMLInputElement>(null);
    const { data: uploadData, setData: setUploadData, post: postUpload, processing: uploading } = useForm({ file: null as File | null });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(`/admin/surat-pengantar/${record.id}`);
    }

    function submitUpload(e: React.FormEvent) {
        e.preventDefault();
        postUpload(`/admin/surat-pengantar/${record.id}/upload`, { forceFormData: true });
    }

    return (
        <>
            <Head title="Edit Surat Pengantar" />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/surat-pengantar"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h1 className="text-2xl font-semibold">Edit Surat Pengantar</h1>
                    <StatusBadge value={record.status} />
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Peserta (opsional)</Label>
                        <Select value={data.user_id} onValueChange={v => setData('user_id', v)}>
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
                    </div>
                    <div className="space-y-1">
                        <Label>Keperluan *</Label>
                        <Textarea rows={4} value={data.keperluan} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('keperluan', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal Pengajuan *</Label>
                        <Input type="date" value={data.tanggal_pengajuan} onChange={e => setData('tanggal_pengajuan', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={v => setData('status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {['pending','diproses','selesai','ditolak'].map(s => (
                                    <SelectItem key={s} value={s}><StatusBadge value={s} /></SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                </form>

                {record.supporting_file_path && (
                    <div className="bg-muted/40 p-4 rounded-md border space-y-2">
                        <p className="text-sm font-medium">Berkas Pendukung Pengajuan (dari Peserta):</p>
                        <a
                            href={`/admin/letters/supporting/pengantar/${record.id}/download`}
                            className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-semibold"
                        >
                            <Download className="h-4 w-4" /> Download Berkas Pendukung
                        </a>
                    </div>
                )}

                <Separator />

                {/* File Upload Section */}
                <div className="space-y-3">
                    <h2 className="font-medium">Upload Surat PDF</h2>
                    {record.file_path && (
                        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                            <Download className="h-4 w-4" />
                            <span>File tersedia</span>
                        </div>
                    )}
                    <form onSubmit={submitUpload} className="flex gap-2 items-center">
                        <Input
                            type="file"
                            accept=".pdf"
                            ref={fileRef}
                            onChange={e => setUploadData('file', e.target.files?.[0] ?? null)}
                        />
                        <Button type="submit" disabled={uploading || !uploadData.file} variant="secondary">
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
