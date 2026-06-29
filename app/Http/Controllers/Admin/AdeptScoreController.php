<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdeptScore;
use App\Models\AdeptSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdeptScoreController extends Controller
{
    public function store(Request $request, AdeptSession $adeptSession): RedirectResponse
    {
        $data = $request->validate([
            'nama_peserta' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'user_id' => ['nullable', 'exists:users,id'],
            'skor' => ['required', 'integer', 'min:0'],
        ]);

        $adeptSession->scores()->create($data);

        return back()->with('success', 'Skor berhasil ditambahkan.');
    }

    public function update(Request $request, AdeptSession $adeptSession, AdeptScore $score): RedirectResponse
    {
        $data = $request->validate([
            'nama_peserta' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:50'],
            'user_id' => ['nullable', 'exists:users,id'],
            'skor' => ['required', 'integer', 'min:0'],
        ]);

        $score->update($data);

        return back()->with('success', 'Skor berhasil diperbarui.');
    }

    public function destroy(AdeptSession $adeptSession, AdeptScore $score): RedirectResponse
    {
        $score->delete();

        return back()->with('success', 'Skor berhasil dihapus.');
    }
}
