<?php

namespace Database\Seeders;

use App\Models\AdeptScore;
use App\Models\AdeptSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdeptSessionSeeder extends Seeder
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

        $session1 = AdeptSession::create([
            'created_by' => $admin->id,
            'nama_sesi' => 'Tes ADEPT Periode Mei 2026',
            'tanggal_tes' => now()->subDays(30)->toDateString(),
            'status' => 'dipublikasikan',
        ]);

        AdeptScore::create([
            'session_id' => $session1->id,
            'user_id' => $peserta1->id,
            'nama_peserta' => $peserta1->name,
            'student_id' => $peserta1->student_id,
            'skor' => 385,
        ]);

        AdeptScore::create([
            'session_id' => $session1->id,
            'user_id' => $peserta2->id,
            'nama_peserta' => $peserta2->name,
            'student_id' => $peserta2->student_id,
            'skor' => 420,
        ]);

        AdeptScore::create([
            'session_id' => $session1->id,
            'user_id' => $peserta3->id,
            'nama_peserta' => $peserta3->name,
            'student_id' => $peserta3->student_id,
            'skor' => 290,
        ]);

        $session2 = AdeptSession::create([
            'created_by' => $admin->id,
            'nama_sesi' => 'Tes ADEPT Periode Juni 2026',
            'tanggal_tes' => now()->subDays(15)->toDateString(),
            'status' => 'draft',
        ]);

        AdeptScore::create([
            'session_id' => $session2->id,
            'user_id' => $peserta1->id,
            'nama_peserta' => $peserta1->name,
            'student_id' => $peserta1->student_id,
            'skor' => 410,
        ]);
    }
}
