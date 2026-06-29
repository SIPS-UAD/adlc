<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin ADLC',
            'email' => 'admin@adlc.test',
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin 2',
            'email' => 'admin2@adlc.test',
        ]);

        User::factory()->applicant('2021010001')->create([
            'name' => 'Peserta Satu',
            'email' => 'peserta1@adlc.test',
        ]);

        User::factory()->applicant('2021010002')->create([
            'name' => 'Peserta Dua',
            'email' => 'peserta2@adlc.test',
        ]);

        User::factory()->applicant('2021010003')->create([
            'name' => 'Peserta Tiga',
            'email' => 'peserta3@adlc.test',
        ]);
    }
}
