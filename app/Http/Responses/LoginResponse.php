<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $role = auth()->user()->role;

        return redirect()->intended(
            $role === 'admin' ? '/admin/dashboard' : '/portal/dashboard'
        );
    }
}
