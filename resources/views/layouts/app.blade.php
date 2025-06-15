<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Моя Родословная</title>
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('storage/favicon.png') }}">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-gray-900">
<nav class="bg-white shadow p-4">
    <div class="max-w-7xl mx-auto flex justify-between">
        <div class="text-lg font-semibold">FamilyTreeApp</div>
        <div>
            <!-- Навигация при необходимости -->
        </div>
    </div>
</nav>

<main class="py-6">
    @yield('content')
</main>
</body>
</html>
