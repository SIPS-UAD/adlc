<?php

namespace Database\Seeders;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransaksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        if (! $admin) {
            return;
        }

        Transaksi::create([
            'created_by' => $admin->id,
            'jenis' => 'pemasukan',
            'kategori' => 'pendaftaran',
            'deskripsi' => 'Pendaftaran Tes TOEFL ADEPT Batch 1 2026',
            'jumlah' => 2500000.00,
            'tanggal' => now()->subDays(8)->toDateString(),
        ]);

        Transaksi::create([
            'created_by' => $admin->id,
            'jenis' => 'pengeluaran',
            'kategori' => 'operasional',
            'deskripsi' => 'Pembelian ATK dan Kertas Sertifikat',
            'jumlah' => 450000.00,
            'tanggal' => now()->subDays(6)->toDateString(),
        ]);

        Transaksi::create([
            'created_by' => $admin->id,
            'jenis' => 'pemasukan',
            'kategori' => 'kursus',
            'deskripsi' => 'Pembayaran Kursus TOEFL Preparation - Peserta Batch A',
            'jumlah' => 3200000.00,
            'tanggal' => now()->subDays(4)->toDateString(),
        ]);

        Transaksi::create([
            'created_by' => $admin->id,
            'jenis' => 'pengeluaran',
            'kategori' => 'honor',
            'deskripsi' => 'Honor Pengajar Kursus TOEFL Batch A',
            'jumlah' => 1200000.00,
            'tanggal' => now()->subDays(2)->toDateString(),
        ]);
    }
}
