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

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'url_img' => 'required|string',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Пользователь не авторизован'], 401);
        }

        // Можно проверить url_img на корректность, например, что файл реально загружен и лежит в storage

        $user->url_img = $request->input('url_img');
        $user->save();

        return response()->json(['message' => 'Фото профиля обновлено']);
    }

    // Изменение имени
    public function rename(Request $request)
    {
        $request->validate(['username' => 'required|string|max:255']);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        $user->username = $request->input('username');
        $user->save();

        return response()->json(['message' => 'Имя изменено']);
    }

    // Изменение пароля
    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        // Проверка текущего пароля
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['error' => 'Текущий пароль неверен'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Пароль изменён']);
    }

    // Удаление аккаунта
    public function deleteAccount(Request $request)
    {
        $request->validate(['password' => 'required|string']);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Не авторизован'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Пароль неверен'], 422);
        }

        // Удаляем пользователя и связанные данные (если нужно)

        // Обёртка на случай транзакции
        DB::transaction(function () use ($user) {
            // Тут можешь добавить удаление связей, данных и т.д.
            $user->delete();
        });

        return response()->json(['message' => 'Аккаунт удалён']);
    }
}
