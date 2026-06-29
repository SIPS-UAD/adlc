<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string|null $student_id
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'student_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isApplicant(): bool
    {
        return $this->role === 'applicant';
    }

    // As applicant — letters owned by this user

    /** @return HasMany<SuratPengantar, $this> */
    public function suratPengantars(): HasMany
    {
        return $this->hasMany(SuratPengantar::class, 'user_id');
    }

    /** @return HasMany<SuratKeterangan, $this> */
    public function suratKeterangans(): HasMany
    {
        return $this->hasMany(SuratKeterangan::class, 'user_id');
    }

    /** @return HasMany<AdeptScore, $this> */
    public function adeptScores(): HasMany
    {
        return $this->hasMany(AdeptScore::class, 'user_id');
    }

    // As admin — records created by this user

    /** @return HasMany<SuratPengantar, $this> */
    public function createdSuratPengantars(): HasMany
    {
        return $this->hasMany(SuratPengantar::class, 'created_by');
    }

    /** @return HasMany<SuratKeterangan, $this> */
    public function createdSuratKeterangans(): HasMany
    {
        return $this->hasMany(SuratKeterangan::class, 'created_by');
    }

    /** @return HasMany<Dokumen, $this> */
    public function dokumens(): HasMany
    {
        return $this->hasMany(Dokumen::class, 'uploaded_by');
    }

    /** @return HasMany<Transaksi, $this> */
    public function transaksis(): HasMany
    {
        return $this->hasMany(Transaksi::class, 'created_by');
    }

    /** @return HasMany<AdeptSession, $this> */
    public function adeptSessions(): HasMany
    {
        return $this->hasMany(AdeptSession::class, 'created_by');
    }
}
