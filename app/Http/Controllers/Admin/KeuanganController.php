<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KeuanganController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaksi::with('creator')->latest('tanggal');

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->string('jenis'));
        }

        if ($request->filled('from')) {
            $query->whereDate('tanggal', '>=', $request->string('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('tanggal', '<=', $request->string('to'));
        }

        $records = $query->paginate(20)->withQueryString();

        // Summary over the same filter (without pagination)
        $summaryQuery = Transaksi::query();
        if ($request->filled('jenis')) {
            $summaryQuery->where('jenis', $request->string('jenis'));
        }
        if ($request->filled('from')) {
            $summaryQuery->whereDate('tanggal', '>=', $request->string('from'));
        }
        if ($request->filled('to')) {
            $summaryQuery->whereDate('tanggal', '<=', $request->string('to'));
        }

        $pemasukan = (clone $summaryQuery)->where('jenis', 'pemasukan')->sum('jumlah');
        $pengeluaran = (clone $summaryQuery)->where('jenis', 'pengeluaran')->sum('jumlah');

        return Inertia::render('admin/keuangan/index', [
            'records' => $records,
            'filters' => $request->only('jenis', 'from', 'to'),
            'summary' => [
                'pemasukan' => $pemasukan,
                'pengeluaran' => $pengeluaran,
                'saldo' => $pemasukan - $pengeluaran,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/keuangan/form');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'jenis' => ['required', 'in:pemasukan,pengeluaran'],
            'kategori' => ['required', 'string', 'max:100'],
            'deskripsi' => ['required', 'string'],
            'jumlah' => ['required', 'numeric', 'min:0'],
            'tanggal' => ['required', 'date'],
        ]);

        Transaksi::create([...$data, 'created_by' => auth()->id()]);

        return redirect()->route('admin.keuangan.index')
            ->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function edit(Transaksi $keuangan): Response
    {
        return Inertia::render('admin/keuangan/form', ['record' => $keuangan]);
    }

    public function update(Request $request, Transaksi $keuangan): RedirectResponse
    {
        $data = $request->validate([
            'jenis' => ['required', 'in:pemasukan,pengeluaran'],
            'kategori' => ['required', 'string', 'max:100'],
            'deskripsi' => ['required', 'string'],
            'jumlah' => ['required', 'numeric', 'min:0'],
            'tanggal' => ['required', 'date'],
        ]);

        $keuangan->update($data);

        return redirect()->route('admin.keuangan.index')
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaksi $keuangan): RedirectResponse
    {
        $keuangan->delete();

        return redirect()->route('admin.keuangan.index')
            ->with('success', 'Transaksi berhasil dihapus.');
    }
}
