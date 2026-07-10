<?php

namespace Database\Seeders;

use App\Models\SuratKeterangan;
use App\Models\User;
use Illuminate\Database\Seeder;

class SuratKeteranganSeeder extends Seeder
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

        SuratKeterangan::create([
            'user_id' => $peserta1->id,
            'created_by' => $admin->id,
            'nama_peserta' => $peserta1->name,
            'student_id' => $peserta1->student_id,
            'nama_kursus' => 'English Proficiency Course',
            'tanggal_pengajuan' => now()->subDays(2)->toDateString(),
            'status' => 'pending',
        ]);

        SuratKeterangan::create([
            'user_id' => $peserta2->id,
            'created_by' => $admin->id,
            'nama_peserta' => $peserta2->name,
            'student_id' => $peserta2->student_id,
            'nama_kursus' => 'Web Development Bootcamp',
            'tanggal_pengajuan' => now()->subDays(10)->toDateString(),
            'status' => 'selesai',
            'file_path' => 'letters/keterangan/sample-keterangan.pdf',
        ]);

        SuratKeterangan::create([
            'user_id' => $peserta3->id,
            'created_by' => $admin->id,
            'nama_peserta' => $peserta3->name,
            'student_id' => $peserta3->student_id,
            'nama_kursus' => 'Mobile App Development with Flutter',
            'tanggal_pengajuan' => now()->subDays(4)->toDateString(),
            'status' => 'ditolak',
        ]);
    }
}
