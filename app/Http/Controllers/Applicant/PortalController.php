<?php

declare(strict_types=1);

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\AdeptScore;
use App\Models\Dokumen;
use App\Models\SuratKeterangan;
use App\Models\SuratPengantar;
use App\Models\User;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PortalController extends Controller
{
    public function dashboard(): Response
    {
        $user = Auth::user();

        return Inertia::render('applicant/dashboard', [
            'stats' => [
                'pendingSurat' => SuratPengantar::where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                        ->orWhere('student_id', $user->student_id);
                })->where('status', 'pending')->count()
                    + SuratKeterangan::where(function ($q) use ($user) {
                        $q->where('user_id', $user->id)
                            ->orWhere('student_id', $user->student_id);
                    })->where('status', 'pending')->count(),
                'selesaiSurat' => SuratPengantar::where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                        ->orWhere('student_id', $user->student_id);
                })->where('status', 'selesai')->count()
                    + SuratKeterangan::where(function ($q) use ($user) {
                        $q->where('user_id', $user->id)
                            ->orWhere('student_id', $user->student_id);
                    })->where('status', 'selesai')->count(),
                'nilaiCount' => AdeptScore::where('student_id', $user->student_id)
                    ->whereHas('session', fn ($q) => $q->where('status', 'dipublikasikan'))
                    ->count(),
            ],
        ]);
    }

    public function surat(): Response
    {
        $user = Auth::user();

        $matchScope = function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->orWhere('student_id', $user->student_id);
        };

        return Inertia::render('applicant/surat', [
            'pengantars' => SuratPengantar::where($matchScope)
                ->latest()
                ->get(['id', 'nama_pemohon', 'keperluan', 'tanggal_pengajuan', 'status', 'file_path', 'supporting_file_path']),
            'keterangans' => SuratKeterangan::where($matchScope)
                ->latest()
                ->get(['id', 'nama_peserta', 'nama_kursus', 'tanggal_pengajuan', 'status', 'file_path', 'supporting_file_path']),
        ]);
    }

    public function dokumen(Request $request): Response
    {
        $query = Dokumen::latest();

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->string('kategori'));
        }

        return Inertia::render('applicant/dokumen', [
            'records' => $query->get(['id', 'judul', 'kategori', 'file_path', 'created_at']),
            'filters' => $request->only('kategori'),
        ]);
    }

    public function nilaiAdept(): Response
    {
        $user = Auth::user();

        return Inertia::render('applicant/nilai-adept', [
            'scores' => AdeptScore::where('student_id', $user->student_id)
                ->whereHas('session', fn ($q) => $q->where('status', 'dipublikasikan'))
                ->with('session:id,nama_sesi,tanggal_tes')
                ->get(['id', 'session_id', 'nama_peserta', 'student_id', 'skor']),
        ]);
    }

    public function download(string $type, int $id): StreamedResponse
    {
        $user = Auth::user();

        $record = match ($type) {
            'pengantar' => SuratPengantar::where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('student_id', $user->student_id);
            })->where('status', 'selesai')->findOrFail($id),
            'keterangan' => SuratKeterangan::where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('student_id', $user->student_id);
            })->where('status', 'selesai')->findOrFail($id),
            default => abort(404),
        };

        abort_unless($record->file_path && Storage::disk('public')->exists($record->file_path), 404);

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->download($record->file_path);
    }

    public function storeSuratPengantar(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $request->validate([
            'nama_pemohon' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'keperluan' => ['required', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpg,png,jpeg', 'max:' . config('filesystems.max_file_size')],
        ]);

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->storeAs(
                'letters/pengantar/supporting',
                Str::uuid().'.'.$request->file('file')->extension(),
                'public'
            );
        }

        SuratPengantar::create([
            'user_id' => $user->id,
            'created_by' => (User::where('role', 'admin')->first() ?? $user)->id,
            'nama_pemohon' => $request->string('nama_pemohon')->toString(),
            'student_id' => $request->string('student_id')->toString(),
            'keperluan' => $request->string('keperluan')->toString(),
            'tanggal_pengajuan' => now()->toDateString(),
            'status' => 'pending',
            'supporting_file_path' => $path,
        ]);

        return back()->with('success', 'Pengajuan surat pengantar berhasil dikirim.');
    }

    public function storeSuratKeterangan(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $request->validate([
            'nama_peserta' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'nama_kursus' => ['required', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpg,png,jpeg', 'max:' . config('filesystems.max_file_size')],
        ]);

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->storeAs(
                'letters/keterangan/supporting',
                Str::uuid().'.'.$request->file('file')->extension(),
                'public'
            );
        }

        SuratKeterangan::create([
            'user_id' => $user->id,
            'created_by' => (User::where('role', 'admin')->first() ?? $user)->id,
            'nama_peserta' => $request->string('nama_peserta')->toString(),
            'student_id' => $request->string('student_id')->toString(),
            'nama_kursus' => $request->string('nama_kursus')->toString(),
            'tanggal_pengajuan' => now()->toDateString(),
            'status' => 'pending',
            'supporting_file_path' => $path,
        ]);

        return back()->with('success', 'Pengajuan surat keterangan berhasil dikirim.');
    }

    public function downloadSupporting(string $type, int $id): StreamedResponse
    {
        $user = Auth::user();

        $record = match ($type) {
            'pengantar' => SuratPengantar::where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('student_id', $user->student_id);
            })->findOrFail($id),
            'keterangan' => SuratKeterangan::where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('student_id', $user->student_id);
            })->findOrFail($id),
            default => abort(404),
        };

        abort_unless($record->supporting_file_path && Storage::disk('public')->exists($record->supporting_file_path), 404);

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->download($record->supporting_file_path);
    }
}
