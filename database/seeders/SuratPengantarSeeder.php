<?php

namespace Database\Seeders;

use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Database\Seeder;

class SuratPengantarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $peserta1 = User::where('email', 'peserta1@adlc.test')->first();
        $peserta2 = User::where('email', 'peserta2@adlc.test')->first();
        $peserta3 = User::where('email', 'peserta3@adlc.test')->first();

        if (! $admin || ! $peserta1 || ! $peserta2 || ! $peserta3) {
            return;
        }

        SuratPengantar::create([
            'user_id' => $peserta1->id,
            'created_by' => $admin->id,
            'nama_pemohon' => $peserta1->name,
            'student_id' => $peserta1->student_id,
            'keperluan' => 'Pengajuan Beasiswa Bank Indonesia',
            'tanggal_pengajuan' => now()->subDays(3)->toDateString(),
            'status' => 'pending',
        ]);

        SuratPengantar::create([
            'user_id' => $peserta2->id,
            'created_by' => $admin->id,
            'nama_pemohon' => $peserta2->name,
            'student_id' => $peserta2->student_id,
            'keperluan' => 'Izin Penelitian di PT Kereta Api Indonesia',
            'tanggal_pengajuan' => now()->subDays(5)->toDateString(),
            'status' => 'selesai',
            'file_path' => 'letters/pengantar/sample-pengantar.pdf',
        ]);

        SuratPengantar::create([
            'user_id' => $peserta3->id,
            'created_by' => $admin->id,
            'nama_pemohon' => $peserta3->name,
            'student_id' => $peserta3->student_id,
            'keperluan' => 'Pengajuan Kerja Praktik (KP) di Telkom Indonesia',
            'tanggal_pengajuan' => now()->subDay()->toDateString(),
            'status' => 'diproses',
        ]);
    }
}
