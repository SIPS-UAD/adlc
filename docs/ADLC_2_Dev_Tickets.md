# ADLC Administration System — Dev Tickets
**Prototype Scope — Actionable Tasks for Developers**

> Each ticket below is one unit of dev work. Acceptance criteria are intentionally loose for the prototype — the goal is a working flow, not pixel-perfect UI or exhaustive validation.

---

## Auth & Users

### AUTH-01 — Admin login
**Role:** Admin

As an admin, I can log in with email and password.

- Login page at `/login`
- Redirects to admin dashboard on success
- Shows error on wrong credentials

---

### AUTH-02 — Applicant login
**Role:** Applicant

As an applicant, I can log in with email and password.

- Same login page as admin
- Redirects to applicant portal on success

---

### AUTH-03 — Admin creates users
**Role:** Admin

As an admin, I can create a new user account and assign a role.

- User management page listing all users
- Create form: name, email, password, role
- Role dropdown: `admin`, `applicant`

---

### AUTH-04 — Role-based redirect
**Role:** System

The system redirects users to the right dashboard based on their role.

- Admin → `/admin/dashboard`
- Applicant → `/portal/dashboard`
- Unauthenticated → `/login`

---

## Module 1 — Surat Pengantar Kaprodi

### SP-01 — Admin views letter list
**Role:** Admin

As an admin, I can see a list of all surat pengantar records.

- Table columns: Nama, Student ID, Purpose, Date, Status
- Search by name or student ID
- Filter by status

---

### SP-02 — Admin creates letter record
**Role:** Admin

As an admin, I can create a new surat pengantar record.

- Form fields: Nama Pemohon, Student ID, linked User (dropdown), Keperluan, Date
- Saves with `status = pending`
- Appears in list after save

---

### SP-03 — Admin uploads signed PDF
**Role:** Admin

As an admin, I can open a record and upload a signed PDF.

- Detail page shows all fields + upload area
- File input accepts PDF only
- File stored at `storage/letters/pengantar/`
- Upload button only enabled when a file is selected

---

### SP-04 — Admin changes status
**Role:** Admin

As an admin, I can change the status of a surat pengantar.

- Status options: `pending`, `diproses`, `selesai`, `ditolak`
- Status displayed with a color badge

---

### SP-05 — Admin edits or deletes record
**Role:** Admin

As an admin, I can edit or delete a surat pengantar record.

- Edit reopens the form with existing values
- Delete asks for confirmation before removing

---

### SP-06 — Applicant views their letters
**Role:** Applicant

As an applicant, I can view my surat pengantar on my portal.

- Shows only records linked to my user account
- Columns: Purpose, Date, Status
- Download button visible only when `status = selesai` AND a file exists

---

### SP-07 — Applicant downloads letter PDF
**Role:** Applicant

As an applicant, I can download my surat pengantar PDF.

- Clicking Download opens/downloads the uploaded PDF
- No access to other applicants' files

---

## Module 2 — Surat Keterangan Kursus / Pelatihan

### SK-01 — Admin views surat keterangan list
**Role:** Admin

As an admin, I can see a list of all surat keterangan records.

- Table columns: Nama, Student ID, Course Name, Status
- Search + filter by status

---

### SK-02 — Admin creates surat keterangan record
**Role:** Admin

As an admin, I can create a surat keterangan record.

- Form fields: Nama, Student ID, linked User, Course/Training Name, Date
- Saves with `status = pending`

---

### SK-03 — Admin uploads signed PDF
**Role:** Admin

As an admin, I can upload a signed PDF to a surat keterangan record.

- Same upload behavior as SP-03
- File stored at `storage/letters/keterangan/`

---

### SK-04 — Admin manages status and record
**Role:** Admin

As an admin, I can change status and edit/delete a surat keterangan record.

- Same status options as Module 1
- Edit and delete with confirmation

---

### SK-05 — Applicant views and downloads surat keterangan
**Role:** Applicant

As an applicant, I can view and download my surat keterangan.

- Shown on portal alongside Module 1 letters (separate tab or section)
- Download visible only when `selesai` + file exists

---

## Module 3 — Dokumen SOP / Aturan / SK

### DOC-01 — Admin uploads document
**Role:** Admin

As an admin, I can upload a document to the repository.

- Form: Title, Category (`sop` / `aturan` / `sk` / `lainnya`), File upload (PDF or DOCX)
- Appears in list after save

---

### DOC-02 — Admin edits document
**Role:** Admin

As an admin, I can edit a document's title/category or replace the file.

- Edit form pre-filled with existing values
- Replacing file overwrites the stored path

---

### DOC-03 — Admin deletes document
**Role:** Admin

As an admin, I can delete a document from the repository.

- Confirmation dialog before delete
- File removed from storage too

---

### DOC-04 — All users browse documents
**Role:** All users

As any logged-in user, I can browse and filter the document list.

- Filter by category
- Columns: Title, Category, Upload Date, Download button

---

### DOC-05 — All users download document
**Role:** All users

As any logged-in user, I can download a document.

- Download serves the stored file directly

---

## Module 4 — Keuangan

### KEU-01 — Admin views transaction list
**Role:** Admin

As an admin, I can see a list of financial transactions.

- Table columns: Date, Type (Pemasukan/Pengeluaran), Category, Description, Amount
- Summary cards at top: Total Pemasukan, Total Pengeluaran, Saldo

---

### KEU-02 — Admin adds transaction
**Role:** Admin

As an admin, I can add a financial transaction.

- Form: Type, Category (free text for prototype), Description, Amount, Date
- Saved record appears in list

---

### KEU-03 — Admin edits or deletes transaction
**Role:** Admin

As an admin, I can edit or delete a transaction.

- Edit reopens form with existing values
- Delete with confirmation

---

### KEU-04 — Admin filters transactions
**Role:** Admin

As an admin, I can filter transactions by date range or type.

- Date from/to inputs + type dropdown filter
- Summary cards update to reflect filtered results

---

## Module 5 — Skor ADEPT

### ADEPT-01 — Admin creates test session
**Role:** Admin

As an admin, I can create a new ADEPT test session.

- Form: Session Name, Test Date
- Saves with `status = draft`
- Appears in session list

---

### ADEPT-02 — Admin enters scores
**Role:** Admin

As an admin, I can enter scores for participants in a session.

- Session detail page shows a table of score entries
- Add row: Nama, Student ID, linked User (optional), Score
- Can add multiple rows

---

### ADEPT-03 — Admin edits or deletes scores
**Role:** Admin

As an admin, I can edit or delete individual score entries.

- Inline edit or edit form per row
- Delete row with confirmation

---

### ADEPT-04 — Admin views session statistics
**Role:** Admin

As an admin, I can see basic statistics for a session.

- Shown on session detail page: Average score, Highest, Lowest, Total participants

---

### ADEPT-05 — Admin publishes session
**Role:** Admin

As an admin, I can publish a session so participants can see their scores.

- 'Publikasikan' button on session detail page
- Status changes from `draft` to `dipublikasikan`
- Confirmation prompt before publish

---

### ADEPT-06 — Applicant views their scores
**Role:** Applicant

As an applicant, I can view my ADEPT scores from published sessions.

- Portal page shows: Session Name, Date, My Score
- Only scores where `student_id` matches my profile
- Scores from `draft` sessions are hidden
