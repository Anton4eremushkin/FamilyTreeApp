<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Account;

class RegisterController extends Controller
{
    public function show()
    {
        return view('auth.register'); // файл resources/views/auth/register.blade.php
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:64|unique:account,username',
            'email' => 'required|email|max:256|unique:account,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $account = Account::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'url_img' => '/default-avatar.png', // временно
        ]);

        // Вход после регистрации
        auth()->login($account);

        return redirect('/'); // или на страницу профиля
    }
}

