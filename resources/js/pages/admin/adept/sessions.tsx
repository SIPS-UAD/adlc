import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';

interface Session { id: number; nama_sesi: string; tanggal_tes: string; status: string; scores_count: number }

export default function AdeptSessions({ sessions }: { sessions: Session[] }) {
    function confirmDelete(id: number) {
        if (confirm('Hapus sesi ini?')) router.delete(`/admin/adept/sessions/${id}`);
    }

    return (
        <>
            <Head title="Sesi ADEPT" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Sesi ADEPT</h1>
                    <Link href="/admin/adept/sessions/create"><Button><PlusCircle className="mr-2 h-4 w-4" /> Buat Sesi</Button></Link>
                </div>
                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nama Sesi</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Tes</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Peserta</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sessions.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Belum ada sesi.</td></tr>}
                            {sessions.map(s => (
                                <tr key={s.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{s.nama_sesi}</td>
                                    <td className="px-4 py-3">{s.tanggal_tes}</td>
                                    <td className="px-4 py-3"><StatusBadge value={s.status} /></td>
                                    <td className="px-4 py-3">{s.scores_count} peserta</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/adept/sessions/${s.id}`}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
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
