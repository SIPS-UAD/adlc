<?php

namespace Database\Seeders;

use App\Models\Dokumen;
use App\Models\User;
use Illuminate\Database\Seeder;

class DokumenSeeder extends Seeder
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

        Dokumen::create([
            'uploaded_by' => $admin->id,
            'judul' => 'Buku Panduan Akademik Universitas 2026/2027',
            'kategori' => 'aturan',
            'file_path' => 'documents/panduan-akademik.pdf',
        ]);

        Dokumen::create([
            'uploaded_by' => $admin->id,
            'judul' => 'Syllabus English for Professional Communication',
            'kategori' => 'sop',
            'file_path' => 'documents/silabus-english.pdf',
        ]);

        Dokumen::create([
            'uploaded_by' => $admin->id,
            'judul' => 'Formulir Pendaftaran Sertifikasi Kompetensi IT',
            'kategori' => 'lainnya',
            'file_path' => 'documents/form-sertifikasi.pdf',
        ]);
    }
}
