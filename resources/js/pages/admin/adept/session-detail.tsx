import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface Score {
    id: number;
    session_id: number;
    user_id: number | null;
    nama_peserta: string;
    student_id: string;
    skor: number;
}

interface Session {
    id: number;
    nama_sesi: string;
    tanggal_tes: string;
    status: string;
    created_at: string;
    creator?: { name: string };
}

interface Stats {
    average: number;
    highest: number;
    lowest: number;
    total: number;
}

interface Props {
    session: Session;
    scores: Score[];
    stats: Stats | null;
}

export default function AdeptSessionDetail({ session, scores, stats }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingScore, setEditingScore] = useState<Score | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama_peserta: '',
        student_id: '',
        skor: '',
    });

    function openCreate() {
        setEditingScore(null);
        clearErrors();
        reset('nama_peserta', 'student_id', 'skor');
        setIsOpen(true);
    }

    function openEdit(score: Score) {
        setEditingScore(score);
        clearErrors();
        setData({
            nama_peserta: score.nama_peserta,
            student_id: score.student_id,
            skor: String(score.skor),
        });
        setIsOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        };

        if (editingScore) {
            put(`/admin/adept/sessions/${session.id}/scores/${editingScore.id}`, options);
        } else {
            post(`/admin/adept/sessions/${session.id}/scores`, options);
        }
    }

    function confirmDeleteScore(id: number) {
        if (confirm('Hapus skor peserta ini?')) {
            router.delete(`/admin/adept/sessions/${session.id}/scores/${id}`);
        }
    }

    function publishSession() {
        if (confirm('Publikasikan sesi ini? Peserta akan dapat melihat nilai mereka.')) {
            router.post(`/admin/adept/sessions/${session.id}/publish`);
        }
    }

    return (
        <>
            <Head title={`Detail Sesi - ${session.nama_sesi}`} />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/adept/sessions">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold">{session.nama_sesi}</h1>
                            <StatusBadge value={session.status} />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Tanggal Tes: {session.tanggal_tes} | Dibuat oleh: {session.creator?.name ?? 'Admin'}
                        </p>
                    </div>
                    {session.status === 'draft' && (
                        <Button onClick={publishSession} className="ml-auto bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="mr-2 h-4 w-4" /> Publikasikan Sesi
                        </Button>
                    )}
                </div>

                {/* Stats cards */}
                {stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm text-muted-foreground">Total Peserta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm text-muted-foreground">Rata-rata Skor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-blue-600">{stats.average}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm text-muted-foreground">Skor Tertinggi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-green-600">{stats.highest}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm text-muted-foreground">Skor Terendah</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-red-600">{stats.lowest}</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="bg-muted/40 border rounded-lg p-6 text-center text-muted-foreground">
                        Belum ada data statistik karena belum ada peserta yang diinput.
                    </div>
                )}

                {/* Scores section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Daftar Skor Peserta</h2>
                        <Button onClick={openCreate} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Skor
                        </Button>
                    </div>

                    <div className="rounded-md border overflow-x-auto">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Nama Peserta</th>
                                    <th className="px-4 py-3 text-left font-medium">NIM</th>
                                    <th className="px-4 py-3 text-right font-medium">Skor</th>
                                    <th className="px-4 py-3 text-left font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {scores.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                            Belum ada skor peserta untuk sesi ini.
                                        </td>
                                    </tr>
                                )}
                                {scores.map(s => (
                                    <tr key={s.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{s.nama_peserta}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{s.student_id}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-blue-600">{s.skor}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => confirmDeleteScore(s.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Score Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingScore ? 'Edit Skor' : 'Tambah Skor Peserta'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
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
                            <Label htmlFor="student_id">NIM / NIM Peserta *</Label>
                            <Input
                                id="student_id"
                                value={data.student_id}
                                onChange={e => setData('student_id', e.target.value)}
                                placeholder="Contoh: 2021010001"
                            />
                            {errors.student_id && <p className="text-destructive text-xs">{errors.student_id}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="skor">Skor ADEPT *</Label>
                            <Input
                                id="skor"
                                type="number"
                                min="0"
                                value={data.skor}
                                onChange={e => setData('skor', e.target.value)}
                            />
                            {errors.skor && <p className="text-destructive text-xs">{errors.skor}</p>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
