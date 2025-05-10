<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Моя Родословная</title>
    @vite('resources/css/app.welcome.css')
</head>
<body>
<!-- Главная страница -->
<div class="tree-wrapper">
    <div class="tree-header">
        <button>Логотип</button>
        <a href="{{ route('family-tree.create') }}"><button>Дерево</button></a>
        <button>Публичные древа</button>
        @auth
            <button>{{ Auth::user()->username }}</button>

            <!-- POST запрос требует Laravel в целях безопасности -->
            <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                @csrf
                <button type="submit">Выйти</button>
            </form>
        @else
            <a href="{{ route('login') }}"><button>Войти</button></a>
        @endauth
    </div>
    <div class="leaf-section">
        <div class="center-box">Какая-нибудь картинка или текст</div>
        <div class="title">Наше древо</div>
    </div>
    <div class="trunk-section">
        <div>Тут можно сказать что-нибудь про корни семьи</div>
        <div class="register-link">
            Тут можно сделать ссылку на регистрацию (и на стволе тоже можно сделать)
        </div>
    </div>
    <div class="footer">Footer</div>
</div>
</body>
</html>

