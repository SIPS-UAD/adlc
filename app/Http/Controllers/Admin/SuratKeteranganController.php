<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuratKeterangan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SuratKeteranganController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SuratKeterangan::with('applicant', 'creator')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(fn ($q) => $q
                ->where('nama_peserta', 'like', "%{$search}%")
                ->orWhere('student_id', 'like', "%{$search}%")
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return Inertia::render('admin/surat-keterangan/index', [
            'records' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/surat-keterangan/create', [
            'applicants' => User::where('role', 'applicant')->select('id', 'name', 'student_id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'nama_peserta' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'nama_kursus' => ['required', 'string', 'max:255'],
            'tanggal_pengajuan' => ['required', 'date'],
        ]);

        SuratKeterangan::create([
            ...$data,
            'created_by' => Auth::id(),
            'status' => 'pending',
        ]);

        return redirect()->route('admin.surat-keterangan.index')
            ->with('success', 'Surat keterangan berhasil dibuat.');
    }

    public function show(SuratKeterangan $suratKeterangan): Response
    {
        return Inertia::render('admin/surat-keterangan/edit', [
            'record' => $suratKeterangan->load('applicant', 'creator'),
            'applicants' => User::where('role', 'applicant')->select('id', 'name', 'student_id')->get(),
        ]);
    }

    public function edit(SuratKeterangan $suratKeterangan): Response
    {
        return Inertia::render('admin/surat-keterangan/edit', [
            'record' => $suratKeterangan->load('applicant', 'creator'),
            'applicants' => User::where('role', 'applicant')->select('id', 'name', 'student_id')->get(),
        ]);
    }

    public function update(Request $request, SuratKeterangan $suratKeterangan): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'nama_peserta' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'nama_kursus' => ['required', 'string', 'max:255'],
            'tanggal_pengajuan' => ['required', 'date'],
            'status' => ['required', 'in:pending,diproses,selesai,ditolak'],
        ]);

        $suratKeterangan->update($data);

        return back()->with('success', 'Surat keterangan berhasil diperbarui.');
    }

    public function upload(Request $request, SuratKeterangan $suratKeterangan): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:' . config('filesystems.max_file_size')],
        ]);

        if ($suratKeterangan->file_path) {
            Storage::disk('public')->delete($suratKeterangan->file_path);
        }

        $path = $request->file('file')->storeAs(
            'letters/keterangan',
            Str::uuid().'.'.$request->file('file')->extension(),
            'public'
        );

        $suratKeterangan->update(['file_path' => $path]);

        return back()->with('success', 'File berhasil diunggah.');
    }

    public function destroy(SuratKeterangan $suratKeterangan): RedirectResponse
    {
        if ($suratKeterangan->file_path) {
            Storage::disk('public')->delete($suratKeterangan->file_path);
        }

        $suratKeterangan->delete();

        return redirect()->route('admin.surat-keterangan.index')
            ->with('success', 'Surat keterangan berhasil dihapus.');
    }
}
