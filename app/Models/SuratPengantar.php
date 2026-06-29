<?php

namespace App\Models;

use Database\Factories\SuratPengantarFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int $created_by
 * @property string $nama_pemohon
 * @property string $student_id
 * @property string $keperluan
 * @property Carbon $tanggal_pengajuan
 * @property string $status
 * @property string|null $file_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'created_by', 'nama_pemohon', 'student_id', 'keperluan', 'tanggal_pengajuan', 'status', 'file_path'])]
class SuratPengantar extends Model
{
    /** @use HasFactory<SuratPengantarFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_pengajuan' => 'date',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isSelesai(): bool
    {
        return $this->status === 'selesai';
    }

    public function hasFile(): bool
    {
        return $this->file_path !== null;
    }
}
