@extends('layouts.app')

@section('content')
    <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Регистрация</h2>

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <div class="mb-4">
                <label for="username" class="block text-sm font-medium text-gray-700">Имя пользователя</label>
                <input id="username" name="username" type="text" value="{{ old('username') }}" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                @error('username')
                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                @error('email')
                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
                <input id="password" name="password" type="password" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                @error('password')
                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-4">
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Повторите пароль</label>
                <input id="password_confirmation" name="password_confirmation" type="password" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>

            <div class="mb-4">
                <label for="url_img" class="block text-sm font-medium text-gray-700">Ссылка на аватар</label>
                <input id="url_img" name="url_img" type="text" value="{{ old('url_img') }}" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                @error('url_img')
                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Зарегистрироваться
            </button>
        </form>
    </div>
@endsection
