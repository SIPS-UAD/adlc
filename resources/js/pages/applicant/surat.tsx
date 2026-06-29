import { Head, usePage, useForm } from '@inertiajs/react';
import { Download, PlusCircle, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Auth } from '@/types';
import { Textarea } from '@/components/ui/textarea';

interface Pengantar {
    id: number;
    nama_pemohon: string;
    keperluan: string;
    tanggal_pengajuan: string;
    status: string;
    file_path: string | null;
    supporting_file_path: string | null;
}

interface Keterangan {
    id: number;
    nama_peserta: string;
    nama_kursus: string;
    tanggal_pengajuan: string;
    status: string;
    file_path: string | null;
    supporting_file_path: string | null;
}

interface Props {
    pengantars: Pengantar[];
    keterangans: Keterangan[];
}

export default function ApplicantSuratIndex({ pengantars, keterangans }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [tab, setTab] = useState<'pengantar' | 'keterangan'>('pengantar');
    const [isOpen, setIsOpen] = useState(false);
    const [tipeSurat, setTipeSurat] = useState<'pengantar' | 'keterangan'>('pengantar');

    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm({
        nama_pemohon: auth.user.name,
        nama_peserta: auth.user.name,
        student_id: auth.user.student_id ?? '',
        keperluan: '',
        nama_kursus: '',
        file: null as File | null,
    });

    function openRequestModal() {
        clearErrors();
        reset();
        setIsOpen(true);
    }

    function submitRequest(e: React.FormEvent) {
        e.preventDefault();
        const url = tipeSurat === 'pengantar' ? '/portal/surat/pengantar' : '/portal/surat/keterangan';
        
        post(url, {
            forceFormData: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    }

    return (
        <>
            <Head title="Surat Saya" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Daftar Pengajuan Surat</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Lihat status pengajuan surat Anda dan unduh jika surat sudah selesai ditandatangani.
                        </p>
                    </div>
                    <Button onClick={openRequestModal}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Buat Pengajuan
                    </Button>
                </div>

                {/* Custom Tab buttons */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setTab('pengantar')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            tab === 'pengantar'
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Surat Pengantar Kaprodi
                    </button>
                    <button
                        onClick={() => setTab('keterangan')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            tab === 'keterangan'
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Surat Keterangan Kursus
                    </button>
                </div>

                {/* Surat Pengantar Tab Content */}
                {tab === 'pengantar' && (
                    <div className="rounded-md border overflow-x-auto">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Pemohon</th>
                                    <th className="px-4 py-3 text-left font-medium">Keperluan</th>
                                    <th className="px-4 py-3 text-left font-medium">Tanggal Pengajuan</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Berkas Pendukung</th>
                                    <th className="px-4 py-3 text-left font-medium">Hasil Surat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pengantars.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            Tidak ada riwayat pengajuan surat pengantar.
                                        </td>
                                    </tr>
                                )}
                                {pengantars.map(p => (
                                    <tr key={p.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{p.nama_pemohon}</td>
                                        <td className="px-4 py-3 max-w-md truncate">{p.keperluan}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{p.tanggal_pengajuan}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge value={p.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.supporting_file_path ? (
                                                <a
                                                    href={`/portal/letters/supporting/pengantar/${p.id}/download`}
                                                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline"
                                                >
                                                    <Paperclip className="h-3.5 w-3.5" /> Berkas
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.status === 'selesai' && p.file_path ? (
                                                <a
                                                    href={`/portal/letters/pengantar/${p.id}/download`}
                                                    className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:underline font-medium animate-pulse"
                                                >
                                                    <Download className="h-4 w-4" /> Unduh PDF
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">Belum tersedia</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Surat Keterangan Tab Content */}
                {tab === 'keterangan' && (
                    <div className="rounded-md border overflow-x-auto">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Nama Peserta</th>
                                    <th className="px-4 py-3 text-left font-medium">Nama Kursus</th>
                                    <th className="px-4 py-3 text-left font-medium">Tanggal Pengajuan</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Berkas Pendukung</th>
                                    <th className="px-4 py-3 text-left font-medium">Hasil Surat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {keterangans.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            Tidak ada riwayat pengajuan surat keterangan.
                                        </td>
                                    </tr>
                                )}
                                {keterangans.map(k => (
                                    <tr key={k.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{k.nama_peserta}</td>
                                        <td className="px-4 py-3">{k.nama_kursus}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{k.tanggal_pengajuan}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge value={k.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {k.supporting_file_path ? (
                                                <a
                                                    href={`/portal/letters/supporting/keterangan/${k.id}/download`}
                                                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline"
                                                >
                                                    <Paperclip className="h-3.5 w-3.5" /> Berkas
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {k.status === 'selesai' && k.file_path ? (
                                                <a
                                                    href={`/portal/letters/keterangan/${k.id}/download`}
                                                    className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:underline font-medium animate-pulse"
                                                >
                                                    <Download className="h-4 w-4" /> Unduh PDF
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">Belum tersedia</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Request Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Buat Pengajuan Surat</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitRequest} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="tipe_surat">Tipe Surat *</Label>
                            <Select
                                value={tipeSurat}
                                onValueChange={v => {
                                    setTipeSurat(v as any);
                                    clearErrors();
                                }}
                            >
                                <SelectTrigger id="tipe_surat">
                                    <SelectValue placeholder="Pilih Tipe Surat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pengantar">Surat Pengantar Kaprodi</SelectItem>
                                    <SelectItem value="keterangan">Surat Keterangan Kursus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {tipeSurat === 'pengantar' ? (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="nama_pemohon">Nama Pemohon *</Label>
                                    <Input
                                        id="nama_pemohon"
                                        value={data.nama_pemohon}
                                        onChange={e => setData('nama_pemohon', e.target.value)}
                                    />
                                    {errors.nama_pemohon && <p className="text-destructive text-xs">{errors.nama_pemohon}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="student_id">NIM / NIP Pemohon *</Label>
                                    <Input
                                        id="student_id"
                                        value={data.student_id}
                                        onChange={e => setData('student_id', e.target.value)}
                                    />
                                    {errors.student_id && <p className="text-destructive text-xs">{errors.student_id}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="keperluan">Keperluan / Keterangan *</Label>
                                    <Textarea
                                        id="keperluan"
                                        rows={3}
                                        value={data.keperluan}
                                        onChange={e => setData('keperluan', e.target.value)}
                                    />
                                    {errors.keperluan && <p className="text-destructive text-xs">{errors.keperluan}</p>}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="nama_peserta">Nama Peserta *</Label>
                                    <Input
                                        id="nama_peserta"
                                        value={data.nama_peserta}
                                        onChange={e => setData('nama_peserta', e.target.value)}
                                    />
                                    {errors.nama_peserta && <p className="text-destructive text-xs">{errors.nama_peserta}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="student_id_ket">NIM / NIP Peserta *</Label>
                                    <Input
                                        id="student_id_ket"
                                        value={data.student_id}
                                        onChange={e => setData('student_id', e.target.value)}
                                    />
                                    {errors.student_id && <p className="text-destructive text-xs">{errors.student_id}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="nama_kursus">Nama Kursus / Pelatihan *</Label>
                                    <Input
                                        id="nama_kursus"
                                        value={data.nama_kursus}
                                        onChange={e => setData('nama_kursus', e.target.value)}
                                    />
                                    {errors.nama_kursus && <p className="text-destructive text-xs">{errors.nama_kursus}</p>}
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="file">Upload Berkas Pendukung (PDF/PNG/JPG) (Opsional)</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,image/*"
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
                            <p className="text-[11px] text-muted-foreground">Maksimal ukuran file: 10MB</p>
                            {errors.file && <p className="text-destructive text-xs">{errors.file}</p>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
