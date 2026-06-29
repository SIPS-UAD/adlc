# ADLC Administration System — Simplified PRD
**Prototype Phase — Flows & Screens Only**

> This is a prototype-scoped PRD. Its goal is to define the user flows and key screens for 5 core modules — enough for a developer to build a working prototype. Data fields and business rules will be finalized in a follow-up meeting after the prototype is reviewed.

---

## 1. Roles

| Role | What they do in the prototype |
|---|---|
| **Admin** | Manages all data. Creates records, uploads files, sets statuses. |
| **Applicant / Peserta** | Logs in and sees only their own letters and scores. |

> For the prototype, user creation is done manually by admin (no self-registration needed yet).

---

## 2. Module Flows

### Module 1 — Surat Pengantar Kaprodi

The admin creates a letter request record for a student, then uploads the signed letter PDF. The student logs in and downloads their letter.

**Admin Flow**
1. Go to Surat Pengantar list page
2. Click 'Tambah Surat' → fill in a short form (name, student ID, purpose)
3. Save → record appears in the list with status: `pending`
4. Open the record → upload signed PDF → change status to `selesai`

**Applicant Flow**
1. Log in → lands on 'Surat Saya' page
2. Sees their letter entry with current status
3. If status is `selesai` → Download button appears → clicks to download PDF

**Screens needed**
- Admin: Letter list (table + search) → Create form → Detail/edit page with file upload
- Applicant: My Letters page (read-only list with download button)

---

### Module 2 — Surat Keterangan Kursus / Pelatihan

Same flow pattern as Module 1, but the letter confirms course/training completion. The admin links it to a course name and the applicant views it from their account.

**Admin Flow**
1. Go to Surat Keterangan list page
2. Click 'Tambah' → fill short form (participant name, ID, course/training name)
3. Save → upload signed PDF → set status to `selesai`

**Applicant Flow**
1. Log in → sees Surat Keterangan tab on their portal
2. When status is `selesai` → Download button appears

**Screens needed**
- Admin: Surat Keterangan list → Create form → Detail/edit with file upload
- Applicant: shared portal page showing both Module 1 and Module 2 letters in tabs or sections

> Modules 1 and 2 are nearly identical in flow. The dev can build one component and reuse it for both.

---

### Module 3 — Dokumen SOP / Aturan / SK

A simple document library. Admin uploads institutional documents. All logged-in users can browse and download.

**Admin Flow**
1. Go to Dokumen list page
2. Click 'Upload Dokumen' → enter title, pick category (SOP / Aturan / SK / Lainnya), upload file
3. Document appears in the list → can edit title/category or delete

**All Users Flow**
1. Go to Dokumen page → browse list, filter by category
2. Click Download on any document

**Screens needed**
- Admin: Document list with upload button → upload/edit form
- All users: Document library (read-only list with category filter + download)

---

### Module 4 — Keuangan

Admin records income and expense transactions. The prototype shows a simple ledger and a basic summary (total in vs. total out).

**Admin Flow**
1. Go to Keuangan page → see transaction list and summary cards (total pemasukan / pengeluaran)
2. Click 'Tambah Transaksi' → choose type (Pemasukan / Pengeluaran), fill amount, description, date
3. Save → appears in the list → can edit or delete

**Screens needed**
- Admin only: Transaction list + summary cards → Create/edit form

> Invoice and receipt PDF generation are out of scope for the prototype. Just record the data for now.

---

### Module 5 — Analisis Hasil Skor ADEPT

Admin creates a test session and enters scores per participant. The system shows basic stats. Participants can view their own score once the admin publishes the session.

**Admin Flow**
1. Go to ADEPT Scores → create a new session (name + date)
2. Open session → enter scores per participant (name, ID, score)
3. Review basic stats (average, highest, lowest shown on page)
4. Click 'Publikasikan' → participants can now see their scores

**Applicant Flow**
1. Log in → go to 'Nilai ADEPT' section
2. Sees their score(s) from published sessions (matched by student ID)

**Screens needed**
- Admin: Session list → Session detail (score entry table + stats) → Publish button
- Applicant: My Scores page (read-only, shows score + session name + date)

---

## 3. Navigation Structure

| Role | Nav Items |
|---|---|
| **Admin** | Dashboard · Surat Pengantar · Surat Keterangan · Dokumen · Keuangan · Skor ADEPT · Manajemen User |
| **Applicant** | Surat Saya (tabs: Pengantar / Keterangan) · Dokumen · Nilai ADEPT |

---

## 4. What Is Intentionally Skipped for the Prototype

| Skipped | Why |
|---|---|
| Exact form field validation rules | To be defined after first meeting review |
| Letter number auto-generation format | Client to confirm format |
| Invoice & receipt PDF generation | Not needed to demonstrate the flow |
| Excel import for ADEPT scores | Manual entry is enough for prototype |
| Email / notification system | Out of scope for prototype |
| Financial reports / export | Dashboard summary is enough for now |
| Detailed audit logs | Nice to have, not prototype-critical |
