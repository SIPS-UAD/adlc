import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Record {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'applicant';
    student_id: string | null;
}

export default function UserForm({ record }: { record?: Record }) {
    const isEdit = !!record;
    const { data, setData, post, patch, processing, errors } = useForm({
        name: record?.name ?? '',
        email: record?.email ?? '',
        password: '',
        role: record?.role ?? 'applicant',
        student_id: record?.student_id ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEdit) {
            patch(`/admin/users/${record.id}`);
        } else {
            post('/admin/users');
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} />
            <div className="p-6 max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/users">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">
                        {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="role">Role *</Label>
                        <Select value={data.role} onValueChange={v => setData('role', v as any)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="applicant">Peserta (Applicant)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-destructive text-xs">{errors.role}</p>}
                    </div>

                    {data.role === 'applicant' && (
                        <div className="space-y-1">
                            <Label htmlFor="student_id">NIM / NIP</Label>
                            <Input
                                id="student_id"
                                value={data.student_id}
                                onChange={e => setData('student_id', e.target.value)}
                                placeholder="Contoh: 2021010001"
                            />
                            {errors.student_id && <p className="text-destructive text-xs">{errors.student_id}</p>}
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label htmlFor="password">
                            Password {isEdit ? '(kosongkan jika tidak diubah)' : '*'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah'}
                    </Button>
                </form>
            </div>
        </>
    );
}
