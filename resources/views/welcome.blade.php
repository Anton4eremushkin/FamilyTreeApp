<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Моя Родословная</title>
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('storage/favicon.png') }}">
    @vite('resources/css/app.welcome.css')
</head>
<body>
<div class="page">
    <div class="tree-wrapper">
        <div class="tree-header">
            <button>Логотип</button>
            <a href="{{ route('family-tree.create') }}"><button>Древо</button></a>
            <button>Публичные древа</button>
            @auth
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit">Выйти</button>
                </form>
            @else
                <a href="{{ route('login') }}"><button>Войти</button></a>
            @endauth
        </div>
    </div>
</div>
</body>
</html>
