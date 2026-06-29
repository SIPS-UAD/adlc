import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'applicant';
    student_id: string | null;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function UsersIndex({ users }: Props) {
    function confirmDelete(id: number) {
        if (confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/admin/users/${id}`);
        }
    }

    return (
        <>
            <Head title="Manajemen User" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Manajemen Pengguna</h1>
                    <Link href="/admin/users/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nama</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Role</th>
                                <th className="px-4 py-3 text-left font-medium">NIM / NIP</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Registrasi</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada pengguna.
                                    </td>
                                </tr>
                            )}
                            {users.data.map(u => (
                                <tr key={u.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{u.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge value={u.role} />
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {u.student_id ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.created_at.slice(0, 10)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/users/${u.id}/edit`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(u.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-1 flex-wrap">
                    {users.links.map((link, i) => (
                        link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="px-3 py-1 rounded border text-sm text-muted-foreground opacity-50"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            </div>
        </>
    );
}
