<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход</title>
    <!-- Подключаем Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
    </style>
</head>
<body>
<div class="relative max-w-md w-full mx-auto p-6 rounded-lg shadow-xl bg-white">
    <!-- Кнопка для перехода на регистрацию -->
    <div class="absolute top-4 right-4">
        <a href="{{ route('register.show') }}" class="text-blue-600 hover:text-blue-800 transition text-sm font-medium">
            Еще нет аккаунта?
        </a>
    </div>

    <h2 class="text-3xl font-extrabold mb-8 text-center text-gray-800">Вход</h2>

    <form method="POST" action="{{ route('login.perform') }}" class="space-y-6">
        <!-- @csrf - это Laravel директива, которая вставит токен CSRF -->
        <!-- Здесь я просто добавил комментарий, так как в чистом HTML её нет -->
        <!-- @csrf -->

        <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input id="email" name="email" type="email" required autocomplete="email"
                   class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400"
                   placeholder="example@email.com">
        </div>

        <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Пароль</label>
            <input id="password" name="password" type="password" required autocomplete="current-password"
                   class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400"
                   placeholder="••••••••">
        </div>

        <button type="submit"
                class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-lg font-semibold shadow-md">
            Войти
        </button>
    </form>
</div>
</body>
</html>
