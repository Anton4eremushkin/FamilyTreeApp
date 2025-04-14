<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Моя Родословная</title>
    @vite('resources/css/app.css')
</head>
<body>
<!-- Страница древа -->
<div class="tree-view">
    <div class="tree-view-header">
        <div class="left-buttons">
            <button>Древо 1 ▼</button>
            <button>Пригласить в древо</button>
        </div>
        <div class="right-buttons">
            <button>🔍</button>
            <button>↓</button>
            <button>🌐</button>
            <button>👤</button>
            <button>режим отображения</button>
        </div>
    </div>
    <div class="tree-canvas">
        <div class="node">Женщина</div>
        <div class="line"></div>
        <div class="node">Мужчина</div>

        <div class="canvas-controls">
            <button>🎤</button>
            <button>⚙️</button>
            <button>👤</button>
            <button>＋</button>
            <button>－</button>
        </div>
    </div>
</div>
</body>
</html>

