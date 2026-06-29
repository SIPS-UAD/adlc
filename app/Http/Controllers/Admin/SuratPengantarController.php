<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SuratPengantarController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SuratPengantar::with('applicant', 'creator')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(fn ($q) => $q
                ->where('nama_pemohon', 'like', "%{$search}%")
                ->orWhere('student_id', 'like', "%{$search}%")
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return Inertia::render('admin/surat-pengantar/index', [
            'records' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/surat-pengantar/create', [
            'applicants' => User::where('role', 'applicant')->select('id', 'name', 'student_id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'nama_pemohon' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'keperluan' => ['required', 'string'],
            'tanggal_pengajuan' => ['required', 'date'],
        ]);

        SuratPengantar::create([
            ...$data,
            'created_by' => auth()->id(),
            'status' => 'pending',
        ]);

        return redirect()->route('admin.surat-pengantar.index')
            ->with('success', 'Surat pengantar berhasil dibuat.');
    }

    public function show(SuratPengantar $suratPengantar): Response
    {
        return Inertia::render('admin/surat-pengantar/edit', [
            'record' => $suratPengantar->load('applicant', 'creator'),
            'applicants' => User::where('role', 'applicant')->select('id', 'name', 'student_id')->get(),
        ]);
    }

    public function edit(SuratPengantar $suratPengantar): Response
    {
        return Inertia::render('admin/surat-pengantar/edit', [
            'record' => $suratPengantar->load('applicant', 'creator'),
            'applicants' => User::where('role', 'applicant')->select('id', 'name', 'student_id')->get(),
        ]);
    }

    public function update(Request $request, SuratPengantar $suratPengantar): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'nama_pemohon' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'keperluan' => ['required', 'string'],
            'tanggal_pengajuan' => ['required', 'date'],
            'status' => ['required', 'in:pending,diproses,selesai,ditolak'],
        ]);

        $suratPengantar->update($data);

        return back()->with('success', 'Surat pengantar berhasil diperbarui.');
    }

    public function upload(Request $request, SuratPengantar $suratPengantar): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        // Delete old file if exists
        if ($suratPengantar->file_path) {
            Storage::disk('public')->delete($suratPengantar->file_path);
        }

        $path = $request->file('file')->storeAs(
            'letters/pengantar',
            Str::uuid().'.'.$request->file('file')->extension(),
            'public'
        );

        $suratPengantar->update(['file_path' => $path]);

        return back()->with('success', 'File berhasil diunggah.');
    }

    public function destroy(SuratPengantar $suratPengantar): RedirectResponse
    {
        if ($suratPengantar->file_path) {
            Storage::disk('public')->delete($suratPengantar->file_path);
        }

        $suratPengantar->delete();

        return redirect()->route('admin.surat-pengantar.index')
            ->with('success', 'Surat pengantar berhasil dihapus.');
    }
}
