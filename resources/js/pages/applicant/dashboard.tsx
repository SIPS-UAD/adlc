import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth } from '@/types';

interface Stats {
    pendingSurat: number;
    selesaiSurat: number;
    nilaiCount: number;
}

export default function ApplicantDashboard({ stats }: { stats: Stats }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Portal Peserta" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Portal Peserta ADLC</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Halo, {auth.user.name}. Selamat datang di portal layanan akademik dan pelatihan ADLC.
                    </p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Surat Proses / Pending</CardTitle>
                            <FileText className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingSurat}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Surat Selesai</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.selesaiSurat}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Hasil Tes ADEPT</CardTitle>
                            <Award className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.nilaiCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick actions or info card */}
                <div className="bg-muted/40 border rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-lg">Butuh mengunduh berkas surat selesai atau melihat skor?</h2>
                        <p className="text-muted-foreground text-sm max-w-xl">
                            Silakan akses menu "Surat Saya" untuk mengunduh PDF surat yang telah ditandatangani kaprodi atau cek menu "Nilai ADEPT" untuk melihat riwayat skor tes Anda.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/portal/surat">
                            <Button variant="outline">
                                Surat Saya <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/portal/nilai-adept">
                            <Button>
                                Lihat Nilai <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
