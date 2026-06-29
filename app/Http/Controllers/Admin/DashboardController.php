<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdeptSession;
use App\Models\Dokumen;
use App\Models\SuratKeterangan;
use App\Models\SuratPengantar;
use App\Models\Transaksi;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => User::where('role', 'applicant')->count(),
                'suratPendingCount' => SuratPengantar::where('status', 'pending')->count()
                    + SuratKeterangan::where('status', 'pending')->count(),
                'totalDokumen' => Dokumen::count(),
                'totalSessions' => AdeptSession::count(),
                'totalPemasukan' => Transaksi::where('jenis', 'pemasukan')->sum('jumlah'),
                'totalPengeluaran' => Transaksi::where('jenis', 'pengeluaran')->sum('jumlah'),
            ],
        ]);
    }
}
