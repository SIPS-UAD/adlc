import { Head, router } from '@inertiajs/react';
import { Download, Search } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Record {
    id: number;
    judul: string;
    kategori: string;
    file_path: string;
    created_at: string;
}

interface Props {
    records: Record[];
    filters: { kategori?: string };
}

export default function ApplicantDokumen({ records, filters }: Props) {
    function setKategori(value: string) {
        router.get('/portal/dokumen', { kategori: value === 'all' ? undefined : value }, { preserveState: true });
    }

    return (
        <>
            <Head title="Repositori Dokumen" />
            <div className="p-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold">Repositori Dokumen</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Akses SOP, Aturan Akademik, SK, dan panduan resmi ADLC.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Select value={filters.kategori ?? 'all'} onValueChange={setKategori}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            <SelectItem value="sop">SOP</SelectItem>
                            <SelectItem value="aturan">Aturan Akademik</SelectItem>
                            <SelectItem value="sk">Surat Keputusan (SK)</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {records.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
                            Tidak ada dokumen yang ditemukan.
                        </div>
                    )}
                    {records.map(r => (
                        <div key={r.id} className="border rounded-lg p-4 bg-card flex flex-col justify-between hover:shadow-sm transition-shadow">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <StatusBadge value={r.kategori} />
                                    <span className="text-xs text-muted-foreground">{r.created_at.slice(0, 10)}</span>
                                </div>
                                <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">{r.judul}</h3>
                            </div>
                            <div className="mt-4 pt-3 border-t flex justify-end">
                                <a
                                    href={`/storage/${r.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm" variant="outline">
                                        <Download className="mr-1.5 h-3.5 w-3.5" /> Unduh Dokumen
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
