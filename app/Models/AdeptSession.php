<?php

namespace App\Models;

use Database\Factories\AdeptSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $created_by
 * @property string $nama_sesi
 * @property Carbon $tanggal_tes
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['created_by', 'nama_sesi', 'tanggal_tes', 'status'])]
class AdeptSession extends Model
{
    /** @use HasFactory<AdeptSessionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_tes' => 'date',
        ];
    }

    /** @return HasMany<AdeptScore, $this> */
    public function scores(): HasMany
    {
        return $this->hasMany(AdeptScore::class, 'session_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isDipublikasikan(): bool
    {
        return $this->status === 'dipublikasikan';
    }
}
