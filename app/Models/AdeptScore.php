<?php

namespace App\Models;

use Database\Factories\AdeptScoreFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $session_id
 * @property int|null $user_id
 * @property string $nama_peserta
 * @property string $student_id
 * @property int $skor
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['session_id', 'user_id', 'nama_peserta', 'student_id', 'skor'])]
class AdeptScore extends Model
{
    /** @use HasFactory<AdeptScoreFactory> */
    use HasFactory;

    /** @return BelongsTo<AdeptSession, $this> */
    public function session(): BelongsTo
    {
        return $this->belongsTo(AdeptSession::class, 'session_id');
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
