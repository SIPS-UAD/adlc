<?php

declare(strict_types=1);

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\AdeptScore;
use App\Models\Dokumen;
use App\Models\SuratKeterangan;
use App\Models\SuratPengantar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PortalController extends Controller
{
    public function dashboard(): Response
    {
        $user = auth()->user();

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
        $user = auth()->user();

        $matchScope = function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->orWhere('student_id', $user->student_id);
        };

        return Inertia::render('applicant/surat', [
            'pengantars' => SuratPengantar::where($matchScope)
                ->latest()
                ->get(['id', 'nama_pemohon', 'keperluan', 'tanggal_pengajuan', 'status', 'file_path']),
            'keterangans' => SuratKeterangan::where($matchScope)
                ->latest()
                ->get(['id', 'nama_peserta', 'nama_kursus', 'tanggal_pengajuan', 'status', 'file_path']),
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
        $user = auth()->user();

        return Inertia::render('applicant/nilai-adept', [
            'scores' => AdeptScore::where('student_id', $user->student_id)
                ->whereHas('session', fn ($q) => $q->where('status', 'dipublikasikan'))
                ->with('session:id,nama_sesi,tanggal_tes')
                ->get(['id', 'session_id', 'nama_peserta', 'student_id', 'skor']),
        ]);
    }

    public function download(string $type, int $id): StreamedResponse
    {
        $user = auth()->user();

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

        return Storage::disk('public')->download($record->file_path);
    }
}
