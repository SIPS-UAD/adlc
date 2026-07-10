# ADLC Administration System — Technical Design Doc
**Stack · Conventions · DB Schema (Prototype)**

> Everything here is intentionally minimal — enough to build, easy to change after the first review meeting.

---

## 1. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Laravel 11 | Controllers, models, routes, file storage |
| Frontend | React 18 + Inertia.js | No separate API — Inertia handles page props |
| Styling | Tailwind CSS | Utility classes, no custom CSS framework |
| Database | MySQL 8 | Primary data store |
| Auth | Laravel Breeze (Inertia/React preset) | Gives login/logout/session out of the box |
| File Storage | Laravel local disk (`storage/app/public`) | Symlink via `php artisan storage:link` |
| PDF Gen _(later)_ | barryvdh/laravel-dompdf | Not needed for prototype — skip for now |
| Excel _(later)_ | Maatwebsite/Laravel-Excel | Not needed for prototype — skip for now |

---

## 2. Project Structure

### Laravel (backend)

```
app/
  Http/
    Controllers/
      Admin/
        SuratPengantarController.php
        SuratKeteranganController.php
        DokumenController.php
        KeuanganController.php
        AdeptSessionController.php
        AdeptScoreController.php
        UserController.php
      Applicant/
        PortalController.php
  Models/
    User.php
    SuratPengantar.php
    SuratKeterangan.php
    Dokumen.php
    Transaksi.php
    AdeptSession.php
    AdeptScore.php
routes/
  web.php   ← all routes here (Inertia doesn't need api.php)
```

### React (frontend via Inertia)

```
resources/js/
  Pages/
    Auth/
      Login.jsx
    Admin/
      Dashboard.jsx
      SuratPengantar/   Index.jsx  Create.jsx  Edit.jsx
      SuratKeterangan/  Index.jsx  Create.jsx  Edit.jsx
      Dokumen/          Index.jsx  Form.jsx
      Keuangan/         Index.jsx  Form.jsx
      Adept/            Sessions.jsx  SessionDetail.jsx
      Users/            Index.jsx  Form.jsx
    Applicant/
      Dashboard.jsx
      Surat.jsx         ← shows both Module 1 & 2 in tabs
      Dokumen.jsx
      NilaiAdept.jsx
  Components/
    Layout/   AdminLayout.jsx  ApplicantLayout.jsx
    UI/       Badge.jsx  Table.jsx  FileUpload.jsx  Modal.jsx
```

---

## 3. Route Groups

```php
// web.php

// Auth (Breeze handles these)
Route::get('/login', ...)
Route::post('/login', ...)
Route::post('/logout', ...)

// Admin routes — must be authenticated + role=admin
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::resource('surat-pengantar', Admin\SuratPengantarController::class);
    Route::resource('surat-keterangan', Admin\SuratKeteranganController::class);
    Route::resource('dokumen', Admin\DokumenController::class);
    Route::resource('keuangan', Admin\KeuanganController::class);
    Route::resource('adept/sessions', Admin\AdeptSessionController::class);
    Route::resource('adept/sessions/{session}/scores', Admin\AdeptScoreController::class);
    Route::post('adept/sessions/{session}/publish', ...);
    Route::resource('users', Admin\UserController::class);
});

// Applicant routes — must be authenticated + role=applicant
Route::middleware(['auth', 'role:applicant'])->prefix('portal')->group(function () {
    Route::get('dashboard', [Applicant\PortalController::class, 'dashboard']);
    Route::get('surat', [Applicant\PortalController::class, 'surat']);
    Route::get('dokumen', [Applicant\PortalController::class, 'dokumen']);
    Route::get('nilai-adept', [Applicant\PortalController::class, 'nilaiAdept']);
    Route::get('letters/{id}/download', [Applicant\PortalController::class, 'download']);
});
```

> Use a simple `role` middleware that checks `auth()->user()->role`. For prototype, no need for Spatie permissions yet.

---

## 4. Database Schema

> Column names and types will be refined after the first client review.

### users

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| name | varchar(255) | Full name |
| email | varchar(255) unique | Used for login |
| password | varchar(255) | Hashed |
| role | enum('admin','applicant') | Drives route access |
| student_id | varchar(50) nullable | NIM/NIP — used to match scores and letters |
| created_at / updated_at | timestamps | |

### surat_pengantars

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| user_id | FK → users nullable | Linked applicant account |
| created_by | FK → users | Admin who created |
| nama_pemohon | varchar(255) | |
| student_id | varchar(50) | NIM / NIP |
| keperluan | text | Purpose of the letter |
| tanggal_pengajuan | date | |
| status | enum('pending','diproses','selesai','ditolak') | Default: pending |
| file_path | varchar(500) nullable | Set after admin uploads PDF |
| created_at / updated_at | timestamps | |

### surat_keterangans

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| user_id | FK → users nullable | Linked applicant account |
| created_by | FK → users | |
| nama_peserta | varchar(255) | |
| student_id | varchar(50) | |
| nama_kursus | varchar(255) | Course or training name |
| tanggal_pengajuan | date | |
| status | enum('pending','diproses','selesai','ditolak') | Default: pending |
| file_path | varchar(500) nullable | |
| created_at / updated_at | timestamps | |

### dokumens

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| judul | varchar(255) | Document title |
| kategori | enum('sop','aturan','sk','lainnya') | |
| file_path | varchar(500) | |
| uploaded_by | FK → users | |
| created_at / updated_at | timestamps | |

### transaksis

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| created_by | FK → users | |
| jenis | enum('pemasukan','pengeluaran') | |
| kategori | varchar(100) | Free text for prototype |
| deskripsi | text | |
| jumlah | decimal(15,2) | Amount in IDR |
| tanggal | date | |
| created_at / updated_at | timestamps | |

### adept_sessions

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| created_by | FK → users | |
| nama_sesi | varchar(255) | e.g. ADEPT Batch 12 - Mei 2025 |
| tanggal_tes | date | |
| status | enum('draft','dipublikasikan') | Default: draft |
| created_at / updated_at | timestamps | |

### adept_scores

| Column | Type | Notes |
|---|---|---|
| id | bigint PK auto | |
| session_id | FK → adept_sessions | |
| user_id | FK → users nullable | Linked if account exists |
| nama_peserta | varchar(255) | |
| student_id | varchar(50) | NIM / NIP — used to match to user account |
| skor | int | Total ADEPT score |
| created_at / updated_at | timestamps | |

---

## 5. Key Conventions

### File Storage

- All uploaded files go through Laravel's `Storage` facade
- Storage disk: `public` (symlinked to `storage/app/public`)
- File naming: use `Str::uuid()` + original extension to avoid collisions
- Never store raw user-supplied filenames in the path

```php
// Example upload in controller
$path = $request->file('file')->storeAs(
    'letters/pengantar',
    Str::uuid() . '.' . $request->file('file')->extension(),
    'public'
);
$record->update(['file_path' => $path]);
```

### Inertia Page Props

- Pass only what the page needs — no global data dumps
- Use `Inertia::share()` in `HandleInertiaRequests` middleware for: `auth.user` (with role)
- Admin pages receive paginated collections; applicant pages receive filtered-to-self collections

### Role Check Pattern

```php
// Simple middleware for prototype (app/Http/Middleware/CheckRole.php)
public function handle(Request $request, Closure $next, string $role): Response
{
    if (auth()->user()?->role !== $role) {
        abort(403);
    }
    return $next($request);
}
```

### Applicant Data Scoping

Every applicant-facing query must be scoped to the logged-in user. Never trust route params alone.

```php
// Correct — scope to auth user
$letters = SuratPengantar::where('user_id', auth()->id())->get();

// For ADEPT scores, match by student_id from user profile
$scores = AdeptScore::whereHas('session', fn($q) => $q->where('status', 'dipublikasikan'))
              ->where('student_id', auth()->user()->student_id)
              ->get();
```

---

## 6. Prototype Build Checklist

| # | Task | When |
|---|---|---|
| 1 | Laravel 11 fresh install + Breeze (Inertia/React preset) | Start here |
| 2 | Add `role` and `student_id` columns to users table migration | Day 1 |
| 3 | Create role middleware + register in `bootstrap/app.php` | Day 1 |
| 4 | Create all migrations (6 tables above) | Day 1 |
| 5 | Seed 1 admin user and 2–3 applicant users for testing | Day 1 |
| 6 | Build `AdminLayout` + `ApplicantLayout` components with nav | Day 1–2 |
| 7 | Module 1: Surat Pengantar CRUD + file upload + applicant view | Day 2–3 |
| 8 | Module 2: Surat Keterangan CRUD (reuse Module 1 components) | Day 3 |
| 9 | Module 3: Dokumen upload + browse for all users | Day 4 |
| 10 | Module 4: Keuangan transaction list + create/edit + summary cards | Day 4–5 |
| 11 | Module 5: ADEPT sessions + score entry + publish + applicant view | Day 5–6 |
| 12 | User management page (admin creates/edits users) | Day 6 |
| 13 | Basic dashboard page for both roles | Day 7 |
| 14 | Manual smoke test of all flows end-to-end | Day 7 |
