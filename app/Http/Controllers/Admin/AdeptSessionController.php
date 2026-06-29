<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdeptSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdeptSessionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/adept/sessions', [
            'sessions' => AdeptSession::with('creator')
                ->withCount('scores')
                ->latest('tanggal_tes')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/adept/session-form');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama_sesi' => ['required', 'string', 'max:255'],
            'tanggal_tes' => ['required', 'date'],
        ]);

        $session = AdeptSession::create([
            ...$data,
            'created_by' => auth()->id(),
            'status' => 'draft',
        ]);

        return redirect()->route('admin.adept.sessions.show', $session)
            ->with('success', 'Sesi berhasil dibuat.');
    }

    public function show(AdeptSession $adeptSession): Response
    {
        $scores = $adeptSession->scores()->with('user')->get();

        $stats = $scores->isNotEmpty() ? [
            'average' => round($scores->avg('skor'), 1),
            'highest' => $scores->max('skor'),
            'lowest' => $scores->min('skor'),
            'total' => $scores->count(),
        ] : null;

        return Inertia::render('admin/adept/session-detail', [
            'session' => $adeptSession->load('creator'),
            'scores' => $scores,
            'stats' => $stats,
        ]);
    }

    public function edit(AdeptSession $adeptSession): Response
    {
        return Inertia::render('admin/adept/session-form', ['session' => $adeptSession]);
    }

    public function update(Request $request, AdeptSession $adeptSession): RedirectResponse
    {
        $data = $request->validate([
            'nama_sesi' => ['required', 'string', 'max:255'],
            'tanggal_tes' => ['required', 'date'],
        ]);

        $adeptSession->update($data);

        return back()->with('success', 'Sesi berhasil diperbarui.');
    }

    public function destroy(AdeptSession $adeptSession): RedirectResponse
    {
        $adeptSession->delete();

        return redirect()->route('admin.adept.sessions.index')
            ->with('success', 'Sesi berhasil dihapus.');
    }

    public function publish(AdeptSession $adeptSession): RedirectResponse
    {
        $adeptSession->update(['status' => 'dipublikasikan']);

        return back()->with('success', 'Sesi berhasil dipublikasikan.');
    }
}
