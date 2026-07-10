# ADLC Administration System — Database Design Document
**Prototype Phase · MySQL 8 · Laravel Eloquent**

> The schema is intentionally lean for the prototype. Column constraints and enum values will be hardened after the first client review meeting.

---

## 1. Overview

| Table | Entity | Purpose |
|---|---|---|
| `users` | User | All system users — admins and applicants |
| `surat_pengantars` | Surat Pengantar Kaprodi | Head-of-program introductory letters per applicant |
| `surat_keterangans` | Surat Keterangan Kursus | Course/training completion letters per participant |
| `dokumens` | Dokumen | Internal SOP, regulation, and decree document repository |
| `transaksis` | Transaksi Keuangan | Income and expense financial transaction ledger |
| `adept_sessions` | ADEPT Session | An ADEPT test sitting with date and publish status |
| `adept_scores` | ADEPT Score | Individual participant score records per session |

---

## 2. ERD — Relationship Summary

```
users ──────────────────────────────────────────────────────┐
  │ 1                                                        │
  ├──── 0..N  surat_pengantars  (user_id — applicant owner) │
  │                             (created_by — admin audit)   │
  │                                                          │
  ├──── 0..N  surat_keterangans (user_id — applicant owner) │
  │                             (created_by — admin audit)   │
  │                                                          │
  ├──── 0..N  dokumens          (uploaded_by — admin audit)  │
  │                                                          │
  ├──── 0..N  transaksis        (created_by — admin audit)   │
  │                                                          │
  ├──── 0..N  adept_sessions    (created_by — admin audit)   │
  │               │ 1                                        │
  │               └──── N  adept_scores  (session_id)        │
  │                              │                           │
  └──────────────────────────────┘ (user_id — optional FK)  │
        0..N  adept_scores ────────────────────────────────── ┘
```

**Key:**
- Solid FK = explicit foreign key (preferred, set when user account is linked)
- Soft link = match via `student_id` string (fallback when `user_id` is NULL)
- `?` suffix on a column = nullable

---

## 3. Entity & Column Definitions

### 3.1 `users`

Central identity table. Every person in the system — whether admin or applicant — has exactly one row here. The `role` column drives route-level access control throughout the app.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `name` | VARCHAR(255) | NO | — | Full display name |
| `email` | VARCHAR(255) | NO | — | Unique. Used as login credential |
| `email_verified_at` | TIMESTAMP | YES | NULL | Set by Laravel Breeze on verification |
| `password` | VARCHAR(255) | NO | — | Bcrypt hash |
| `role` | ENUM | NO | `'applicant'` | Controls which routes the user can access |
| `student_id` | VARCHAR(50) | YES | NULL | NIM or NIP. Used to match letters and scores to this account |
| `remember_token` | VARCHAR(100) | YES | NULL | Laravel session remember token |
| `created_at` | TIMESTAMP | YES | NULL | Auto-managed by Eloquent |
| `updated_at` | TIMESTAMP | YES | NULL | Auto-managed by Eloquent |

**Indexes**
- `PRIMARY KEY (id)`
- `UNIQUE KEY (email)`
- `INDEX (role)` — for filtering users by role
- `INDEX (student_id)` — for matching scores and letters

**Enum: `role`**

| Value | Meaning |
|---|---|
| `admin` | ADLC staff. Full read/write access to all modules. |
| `applicant` | Student or course participant. Read-only access to their own records. |

---

### 3.2 `surat_pengantars`

Records each introductory letter request submitted to the Head of Study Program. The admin creates the record, uploads the signed PDF, and sets the status. The linked applicant then views and downloads the letter via their portal.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `user_id` | BIGINT UNSIGNED | YES | NULL | FK → `users.id`. The applicant who owns this letter. Nullable because admin may create before account is linked. |
| `created_by` | BIGINT UNSIGNED | NO | — | FK → `users.id`. The admin who created the record. |
| `nama_pemohon` | VARCHAR(255) | NO | — | Full name of the letter applicant |
| `student_id` | VARCHAR(50) | NO | — | NIM or NIP. Fallback match if `user_id` is null. |
| `keperluan` | TEXT | NO | — | Purpose / reason for the letter |
| `tanggal_pengajuan` | DATE | NO | — | Date the request was submitted |
| `status` | ENUM | NO | `'pending'` | Current letter status |
| `file_path` | VARCHAR(500) | YES | NULL | Storage path of uploaded signed PDF. NULL until admin uploads. |
| `created_at` | TIMESTAMP | YES | NULL | |
| `updated_at` | TIMESTAMP | YES | NULL | |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX (user_id)` — for portal queries scoped to one applicant
- `INDEX (student_id)` — fallback matching
- `INDEX (status)` — for admin list filtering

**Enum: `status`**

| Value | Meaning | File upload available? |
|---|---|---|
| `pending` | Request received, not yet processed | No |
| `diproses` | Being processed by admin | Yes |
| `selesai` | Letter signed and uploaded | Yes — Download button shows to applicant |
| `ditolak` | Request rejected | No |

---

### 3.3 `surat_keterangans`

Records each course/training completion letter. Structurally very similar to `surat_pengantars`, with an extra field for the course name. Both tables share the same status enum and file upload pattern.

> These are kept as **separate tables** — not merged — so each can evolve independently when the real schema is finalized.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `user_id` | BIGINT UNSIGNED | YES | NULL | FK → `users.id`. Nullable — may be created before account is linked. |
| `created_by` | BIGINT UNSIGNED | NO | — | FK → `users.id`. Admin who created. |
| `nama_peserta` | VARCHAR(255) | NO | — | Full name of participant |
| `student_id` | VARCHAR(50) | NO | — | NIM or NIP. Fallback match key. |
| `nama_kursus` | VARCHAR(255) | NO | — | Name of the course or training program |
| `tanggal_pengajuan` | DATE | NO | — | Date of request |
| `status` | ENUM | NO | `'pending'` | Same enum as `surat_pengantars` |
| `file_path` | VARCHAR(500) | YES | NULL | Uploaded signed PDF path |
| `created_at` | TIMESTAMP | YES | NULL | |
| `updated_at` | TIMESTAMP | YES | NULL | |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX (user_id)`
- `INDEX (student_id)`
- `INDEX (status)`

---

### 3.4 `dokumens`

A document repository for institutional files: SOPs, regulations, and decrees (SK). Unlike the letter tables, these are not per-user — they are shared resources accessible to all authenticated users.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `uploaded_by` | BIGINT UNSIGNED | NO | — | FK → `users.id`. Admin who uploaded. |
| `judul` | VARCHAR(255) | NO | — | Document title |
| `kategori` | ENUM | NO | — | Document category for filtering |
| `file_path` | VARCHAR(500) | NO | — | Storage path. Required at upload time (unlike letter tables). |
| `created_at` | TIMESTAMP | YES | NULL | |
| `updated_at` | TIMESTAMP | YES | NULL | |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX (kategori)` — for category filter on the browse page
- `INDEX (uploaded_by)` — for audit purposes

**Enum: `kategori`**

| Value | Meaning |
|---|---|
| `sop` | Standard Operating Procedure |
| `aturan` | Internal regulation or rule |
| `sk` | Surat Keputusan (official decree) |
| `lainnya` | Other / uncategorized document |

---

### 3.5 `transaksis`

A simple ledger for ADLC's income and expenses. Each row is one financial transaction. The summary dashboard computes totals from this table.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `created_by` | BIGINT UNSIGNED | NO | — | FK → `users.id`. Admin who recorded. |
| `jenis` | ENUM | NO | — | Transaction direction |
| `kategori` | VARCHAR(100) | NO | — | Free-text category for prototype (e.g. 'Biaya Kursus', 'ATK') |
| `deskripsi` | TEXT | NO | — | Description of what the transaction is for |
| `jumlah` | DECIMAL(15,2) | NO | — | Amount in IDR. Always positive; `jenis` determines sign. |
| `tanggal` | DATE | NO | — | Date the transaction occurred |
| `created_at` | TIMESTAMP | YES | NULL | |
| `updated_at` | TIMESTAMP | YES | NULL | |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX (jenis)` — for filtering pemasukan vs pengeluaran
- `INDEX (tanggal)` — for date-range filtering and summary cards

**Enum: `jenis`**

| Value | Meaning | Effect on balance |
|---|---|---|
| `pemasukan` | Income / money received | Adds to total balance |
| `pengeluaran` | Expense / money spent | Subtracts from total balance |

---

### 3.6 `adept_sessions`

Each row represents one ADEPT test sitting. A session groups all individual score records for that test date. The `status` field controls whether participants can see their scores.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `created_by` | BIGINT UNSIGNED | NO | — | FK → `users.id`. Admin who created. |
| `nama_sesi` | VARCHAR(255) | NO | — | Human-readable name (e.g. ADEPT Batch 12 - Mei 2025) |
| `tanggal_tes` | DATE | NO | — | Date the test was held |
| `status` | ENUM | NO | `'draft'` | `draft` = hidden from participants; `dipublikasikan` = visible |
| `created_at` | TIMESTAMP | YES | NULL | |
| `updated_at` | TIMESTAMP | YES | NULL | |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX (status)` — for filtering published sessions in applicant queries
- `INDEX (tanggal_tes)` — for sorting and date-range views

**Enum: `status`**

| Value | Meaning |
|---|---|
| `draft` | Scores not yet visible to participants |
| `dipublikasikan` | Participants can see their scores |

---

### 3.7 `adept_scores`

One row per participant per session. `session_id` links to `adept_sessions`; `user_id` optionally links to a registered user account. Matching falls back to `student_id` when `user_id` is absent.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `session_id` | BIGINT UNSIGNED | NO | — | FK → `adept_sessions.id`. The test session this score belongs to. |
| `user_id` | BIGINT UNSIGNED | YES | NULL | FK → `users.id`. Nullable — not all participants may have a system account. |
| `nama_peserta` | VARCHAR(255) | NO | — | Full name |
| `student_id` | VARCHAR(50) | NO | — | NIM or NIP. Primary match key for portal display. |
| `skor` | INT UNSIGNED | NO | — | Total ADEPT score |
| `created_at` | TIMESTAMP | YES | NULL | |
| `updated_at` | TIMESTAMP | YES | NULL | |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX (session_id)` — for loading all scores in a session
- `INDEX (student_id)` — for matching to applicant portal queries
- `INDEX (user_id)` — for direct FK lookup

---

## 4. Relationships

| Relationship | Type | Via Column | Description |
|---|---|---|---|
| `users` → `surat_pengantars` | One-to-Many | `user_id` | One user can have multiple surat pengantar records. Nullable — record may exist before account is linked. |
| `users` → `surat_pengantars` (audit) | One-to-Many | `created_by` | Tracks which admin created each record. Non-nullable. |
| `users` → `surat_keterangans` | One-to-Many | `user_id` | Same pattern as above. |
| `users` → `surat_keterangans` (audit) | One-to-Many | `created_by` | Admin audit trail. |
| `users` → `dokumens` | One-to-Many | `uploaded_by` | Tracks which admin uploaded each document. |
| `users` → `transaksis` | One-to-Many | `created_by` | Tracks which admin recorded each transaction. |
| `users` → `adept_sessions` | One-to-Many | `created_by` | Tracks which admin created each session. |
| `adept_sessions` → `adept_scores` | One-to-Many | `session_id` | One test session contains many individual score records. |
| `users` → `adept_scores` | One-to-Many (optional) | `user_id` | Optional — not all score entries have a registered account. Soft match via `student_id`. |

---

## 5. Applicant-to-Record Matching

A key design decision: how letter and score records are linked to an applicant's user account. Two mechanisms are used.

### 5.1 Hard link via `user_id` (FK)

When admin creates a record and selects a user from the dropdown, `user_id` is set. This is the preferred method — explicit and fast to query.

```sql
-- Applicant portal query (hard link)
SELECT * FROM surat_pengantars
WHERE user_id = :auth_user_id
AND status = 'selesai';
```

### 5.2 Soft match via `student_id`

If `user_id` is NULL (record created before the account existed, or admin didn't select a user), the system falls back to matching `student_id` on the record against `student_id` on the `users` table.

```sql
-- Applicant portal query (soft match fallback)
SELECT * FROM surat_pengantars
WHERE student_id = :auth_user_student_id
AND status = 'selesai';
```

```php
// In Laravel Eloquent — combined query covering both mechanisms
$letters = SuratPengantar::where(function($q) {
    $q->where('user_id', auth()->id())
      ->orWhere('student_id', auth()->user()->student_id);
})->where('status', 'selesai')->get();
```

### 5.3 ADEPT scores — always soft match

Score records may be bulk-entered before participants have accounts. The portal query always matches by `student_id` and filters to published sessions only.

```php
$scores = AdeptScore::where('student_id', auth()->user()->student_id)
    ->whereHas('session', fn($q) =>
        $q->where('status', 'dipublikasikan')
    )->with('session')->get();
```

---

## 6. Migration Order

Migrations must run in this order to satisfy FK constraints:

| Order | Migration File | Creates Table | FK Dependencies |
|---|---|---|---|
| 1 | `create_users_table` | `users` | none |
| 2 | `create_surat_pengantars_table` | `surat_pengantars` | `users` |
| 3 | `create_surat_keterangans_table` | `surat_keterangans` | `users` |
| 4 | `create_dokumens_table` | `dokumens` | `users` |
| 5 | `create_transaksis_table` | `transaksis` | `users` |
| 6 | `create_adept_sessions_table` | `adept_sessions` | `users` |
| 7 | `create_adept_scores_table` | `adept_scores` | `users`, `adept_sessions` |

> The `users` table migration ships with Laravel Breeze. Run `php artisan breeze:install react --ssr` before creating the other migrations.

---

## 7. Laravel Eloquent Model Relationships

### User model

```php
class User extends Authenticatable
{
    // As applicant — letters owned by this user
    public function suratPengantars()
    {
        return $this->hasMany(SuratPengantar::class, 'user_id');
    }

    public function suratKeterangans()
    {
        return $this->hasMany(SuratKeterangan::class, 'user_id');
    }

    // As admin — records created by this user
    public function createdSuratPengantars()
    {
        return $this->hasMany(SuratPengantar::class, 'created_by');
    }

    public function adeptScores()
    {
        return $this->hasMany(AdeptScore::class, 'user_id');
    }
}
```

### SuratPengantar model

```php
class SuratPengantar extends Model
{
    public function applicant()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

// SuratKeterangan is identical in structure
```

### AdeptSession model

```php
class AdeptSession extends Model
{
    public function scores()
    {
        return $this->hasMany(AdeptScore::class, 'session_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
```

### AdeptScore model

```php
class AdeptScore extends Model
{
    public function session()
    {
        return $this->belongsTo(AdeptSession::class, 'session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
```

---

## 8. Seed Data for Prototype Testing

| Seed | Count | Details |
|---|---|---|
| Admin users | 2 | `admin@adlc.test` / `admin2@adlc.test`, `role=admin` |
| Applicant users | 3 | `peserta1@test` / `peserta2@test` / `peserta3@test`, `role=applicant`, with `student_id` set |
| Surat Pengantar records | 6 | 2 per applicant. Mix of statuses. 2 with file uploaded. |
| Surat Keterangan records | 4 | Cover different courses. At least 2 with `selesai` status. |
| Dokumen records | 5 | At least 1 per `kategori` (sop, aturan, sk) |
| Transaksi records | 10 | Mix of pemasukan and pengeluaran across different dates |
| ADEPT Sessions | 2 | 1 `draft`, 1 `dipublikasikan` |
| ADEPT Score records | 8 | 4 per session. Link 3 of them to applicant user accounts. |
