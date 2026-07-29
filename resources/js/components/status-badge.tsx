import { cn } from '@/lib/utils';

const colorMap: Record<string, string> = {
    // Status pengajuan
    pending:        'bg-yellow-500 text-white',
    diproses:       'bg-blue-500 text-white',
    selesai:        'bg-green-500 text-white',
    ditolak:        'bg-red-500 text-white',
    draft:          'bg-gray-400 text-white',
    dipublikasikan: 'bg-green-500 text-white',
    // Keuangan
    pemasukan:      'bg-green-500 text-white',
    pengeluaran:    'bg-red-500 text-white',
    // Dokumen kategori
    sop:            'bg-purple-500 text-white',
    aturan:         'bg-blue-500 text-white',
    sk:             'bg-orange-500 text-white',
    lainnya:        'bg-gray-400 text-white',
    // Visibilitas
    public:         'bg-green-500 text-white',
    private:        'bg-gray-400 text-white',
    // Role pengguna
    admin:          'bg-blue-600 text-white',
    applicant:      'bg-blue-400 text-white',
};

const labelMap: Record<string, string> = {
    pending:        'Pending',
    diproses:       'Diproses',
    selesai:        'Selesai',
    ditolak:        'Ditolak',
    draft:          'Draft',
    dipublikasikan: 'Dipublikasikan',
    pemasukan:      'Pemasukan',
    pengeluaran:    'Pengeluaran',
    sop:            'SOP',
    aturan:         'Aturan',
    sk:             'SK',
    lainnya:        'Lainnya',
    public:         'Publik',
    private:        'Privat',
    admin:          'Admin',
    applicant:      'Applicant',
};

export function StatusBadge({ value }: { value: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                colorMap[value] ?? 'bg-zinc-400 text-white',
            )}
        >
            {labelMap[value] ?? value}
        </span>
    );
}
