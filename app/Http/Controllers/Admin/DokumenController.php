<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DokumenController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Dokumen::with('uploader')->latest();

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->string('kategori'));
        }

        return Inertia::render('admin/dokumen/index', [
            'records' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('kategori'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/dokumen/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:sop,aturan,sk,lainnya'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ]);

        $path = $request->file('file')->storeAs(
            'dokumen',
            Str::uuid().'.'.$request->file('file')->extension(),
            'public'
        );

        Dokumen::create([
            'judul' => $request->string('judul'),
            'kategori' => $request->string('kategori'),
            'file_path' => $path,
            'uploaded_by' => auth()->id(),
        ]);

        return redirect()->route('admin.dokumen.index')
            ->with('success', 'Dokumen berhasil diunggah.');
    }

    public function edit(Dokumen $dokumen): Response
    {
        return Inertia::render('admin/dokumen/form', ['record' => $dokumen]);
    }

    public function update(Request $request, Dokumen $dokumen): RedirectResponse
    {
        $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:sop,aturan,sk,lainnya'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ]);

        $data = [
            'judul' => $request->string('judul'),
            'kategori' => $request->string('kategori'),
        ];

        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($dokumen->file_path);
            $data['file_path'] = $request->file('file')->storeAs(
                'dokumen',
                Str::uuid().'.'.$request->file('file')->extension(),
                'public'
            );
        }

        $dokumen->update($data);

        return redirect()->route('admin.dokumen.index')
            ->with('success', 'Dokumen berhasil diperbarui.');
    }

    public function destroy(Dokumen $dokumen): RedirectResponse
    {
        Storage::disk('public')->delete($dokumen->file_path);
        $dokumen->delete();

        return redirect()->route('admin.dokumen.index')
            ->with('success', 'Dokumen berhasil dihapus.');
    }
}
