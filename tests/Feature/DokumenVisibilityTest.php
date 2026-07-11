<?php

use App\Models\Dokumen;
use App\Models\User;

it('only shows public dokumen to applicants', function () {
    $admin = User::factory()->admin()->create();
    $applicant = User::factory()->applicant()->create();

    Dokumen::create([
        'uploaded_by' => $admin->id,
        'judul' => 'Dokumen Publik',
        'kategori' => 'sop',
        'visibility' => 'public',
        'file_path' => 'dokumen/publik.pdf',
    ]);

    Dokumen::create([
        'uploaded_by' => $admin->id,
        'judul' => 'Dokumen Privat',
        'kategori' => 'aturan',
        'visibility' => 'private',
        'file_path' => 'dokumen/privat.pdf',
    ]);

    actingAs($applicant)
        ->get('/portal/dokumen')
        ->assertOk()
        ->assertSee('Dokumen Publik')
        ->assertDontSee('Dokumen Privat');
});

it('shows both public and private dokumen to admin', function () {
    $admin = User::factory()->admin()->create();

    Dokumen::create([
        'uploaded_by' => $admin->id,
        'judul' => 'Dokumen Publik',
        'kategori' => 'sop',
        'visibility' => 'public',
        'file_path' => 'dokumen/publik.pdf',
    ]);

    Dokumen::create([
        'uploaded_by' => $admin->id,
        'judul' => 'Dokumen Privat',
        'kategori' => 'aturan',
        'visibility' => 'private',
        'file_path' => 'dokumen/privat.pdf',
    ]);

    actingAs($admin)
        ->get('/admin/dokumen')
        ->assertOk()
        ->assertSee('Dokumen Publik')
        ->assertSee('Dokumen Privat');
});
