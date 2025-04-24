<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function show()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        // Валидация
        $request->validate([
            'username' => 'required|string|max:64|unique:users,username',
            'email' => 'required|email|max:256|unique:users,email',
            'password' => 'required|confirmed|min:6',
            'url_img' => 'required|url'
        ]);

        // Создание пользователя
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password, // Laravel сам хеширует через мутатор
            'url_img' => $request->url_img,
        ]);

        // Автоматический вход после регистрации
        Auth::login($user);

        // Редирект, например, на страницу дерева
        return redirect('/tree')->with('success', 'Регистрация успешна!');
    }
}
