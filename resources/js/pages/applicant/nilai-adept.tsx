import { Head } from '@inertiajs/react';
import { Award, FileText } from 'lucide-react';

interface Score {
    id: number;
    session_id: number;
    nama_peserta: string;
    student_id: string;
    skor: number;
    session?: {
        id: number;
        nama_sesi: string;
        tanggal_tes: string;
    };
}

interface Props {
    scores: Score[];
}

export default function ApplicantNilaiAdept({ scores }: Props) {
    return (
        <>
            <Head title="Nilai ADEPT Saya" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Hasil Nilai Tes ADEPT</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Riwayat skor sertifikasi ADEPT Anda yang telah dirilis oleh admin.
                    </p>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Sesi Tes</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Tes</th>
                                <th className="px-4 py-3 text-left font-medium">Nama Peserta</th>
                                <th className="px-4 py-3 text-left font-medium">NIM</th>
                                <th className="px-4 py-3 text-right font-medium">Skor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {scores.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada riwayat hasil tes ADEPT yang dipublikasikan.
                                    </td>
                                </tr>
                            )}
                            {scores.map(s => (
                                <tr key={s.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-blue-500" />
                                            <span>{s.session?.nama_sesi ?? 'Sesi ADEPT'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {s.session?.tanggal_tes ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">{s.nama_peserta}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{s.student_id}</td>
                                    <td className="px-4 py-3 text-right font-bold text-lg text-blue-600">
                                        {s.skor}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
