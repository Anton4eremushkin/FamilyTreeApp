<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getProfile()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'url_img' => $user->url_img,
        ]);
    }
}
