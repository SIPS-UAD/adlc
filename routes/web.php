<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Applicant;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('surat-pengantar', Admin\SuratPengantarController::class);
        Route::post('surat-pengantar/{suratPengantar}/upload', [Admin\SuratPengantarController::class, 'upload'])->name('surat-pengantar.upload');
        Route::resource('surat-keterangan', Admin\SuratKeteranganController::class);
        Route::post('surat-keterangan/{suratKeterangan}/upload', [Admin\SuratKeteranganController::class, 'upload'])->name('surat-keterangan.upload');
        Route::resource('dokumen', Admin\DokumenController::class);
        Route::resource('keuangan', Admin\KeuanganController::class);
        Route::resource('adept/sessions', Admin\AdeptSessionController::class)->names([
            'index' => 'adept.sessions.index',
            'create' => 'adept.sessions.create',
            'store' => 'adept.sessions.store',
            'show' => 'adept.sessions.show',
            'edit' => 'adept.sessions.edit',
            'update' => 'adept.sessions.update',
            'destroy' => 'adept.sessions.destroy',
        ]);
        Route::post('adept/sessions/{adeptSession}/publish', [Admin\AdeptSessionController::class, 'publish'])->name('adept.sessions.publish');
        Route::resource('adept/sessions/{adeptSession}/scores', Admin\AdeptScoreController::class)->names([
            'index' => 'adept.scores.index',
            'create' => 'adept.scores.create',
            'store' => 'adept.scores.store',
            'show' => 'adept.scores.show',
            'edit' => 'adept.scores.edit',
            'update' => 'adept.scores.update',
            'destroy' => 'adept.scores.destroy',
        ]);
        Route::get('letters/supporting/{type}/{id}/download', [Admin\SuratPengantarController::class, 'downloadSupporting'])->name('letters.supporting.download');
        Route::resource('users', Admin\UserController::class);
    });

Route::middleware(['auth', 'verified', 'role:applicant'])
    ->prefix('portal')
    ->name('portal.')
    ->group(function () {
        Route::get('dashboard', [Applicant\PortalController::class, 'dashboard'])->name('dashboard');
        Route::get('surat', [Applicant\PortalController::class, 'surat'])->name('surat');
        Route::post('surat/pengantar', [Applicant\PortalController::class, 'storeSuratPengantar'])->name('surat.pengantar.store');
        Route::post('surat/keterangan', [Applicant\PortalController::class, 'storeSuratKeterangan'])->name('surat.keterangan.store');
        Route::get('dokumen', [Applicant\PortalController::class, 'dokumen'])->name('dokumen');
        Route::get('nilai-adept', [Applicant\PortalController::class, 'nilaiAdept'])->name('nilai-adept');
        Route::get('letters/{type}/{id}/download', [Applicant\PortalController::class, 'download'])->name('letters.download');
        Route::get('letters/supporting/{type}/{id}/download', [Applicant\PortalController::class, 'downloadSupporting'])->name('letters.supporting.download');
    });

require __DIR__.'/settings.php';
