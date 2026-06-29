import { cn } from '@/lib/utils';

const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    diproses: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    selesai: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    ditolak: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    dipublikasikan: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pemasukan: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pengeluaran: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    sop: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    aturan: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    sk: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    lainnya: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const labelMap: Record<string, string> = {
    pending: 'Pending',
    diproses: 'Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    draft: 'Draft',
    dipublikasikan: 'Dipublikasikan',
    pemasukan: 'Pemasukan',
    pengeluaran: 'Pengeluaran',
    sop: 'SOP',
    aturan: 'Aturan',
    sk: 'SK',
    lainnya: 'Lainnya',
};

export function StatusBadge({ value }: { value: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                colorMap[value] ?? 'bg-gray-100 text-gray-700',
            )}
        >
            {labelMap[value] ?? value}
        </span>
    );
}
