import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';

interface Pengantar {
    id: number;
    nama_pemohon: string;
    keperluan: string;
    tanggal_pengajuan: string;
    status: string;
    file_path: string | null;
}

interface Keterangan {
    id: number;
    nama_peserta: string;
    nama_kursus: string;
    tanggal_pengajuan: string;
    status: string;
    file_path: string | null;
}

interface Props {
    pengantars: Pengantar[];
    keterangans: Keterangan[];
}

export default function ApplicantSuratIndex({ pengantars, keterangans }: Props) {
    const [tab, setTab] = useState<'pengantar' | 'keterangan'>('pengantar');

    return (
        <>
            <Head title="Surat Saya" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Daftar Pengajuan Surat</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Lihat status pengajuan surat Anda dan unduh jika surat sudah selesai ditandatangani.
                    </p>
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
                                    <th className="px-4 py-3 text-left font-medium">Berkas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pengantars.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
                                            {p.status === 'selesai' && p.file_path ? (
                                                <a
                                                    href={`/portal/letters/pengantar/${p.id}/download`}
                                                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
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
                                    <th className="px-4 py-3 text-left font-medium">Berkas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {keterangans.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
                                            {k.status === 'selesai' && k.file_path ? (
                                                <a
                                                    href={`/portal/letters/keterangan/${k.id}/download`}
                                                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
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
        </>
    );
}
