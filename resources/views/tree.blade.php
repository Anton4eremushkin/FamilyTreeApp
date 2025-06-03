<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Моя Родословная</title>
    @viteReactRefresh
    @vite(['resources/css/app.tree.css', 'resources/js/tree.jsx'])
</head>
<body>
<div class="tree-view">
    <div class="tree-view-header">
        <div class="left-buttons">
            <button>Древо 1 ▼</button>
            <button>Пригласить в древо</button>
        </div>
        <div class="right-buttons">
            <button>режим отображения</button>
            <button>🔍</button>
            <button>🌐</button>
            <button>⚙️</button>
            <button>👤</button>
        </div>
    </div>

    <div class="tree-canvas">
        <div id="react-flow-root" style="width: 100%; height: 100vh;"></div>
    </div>
</div>

<script>
    // Передаем данные с Blade в React
    window.peopleData = @json($people);
    window.relationData = @json($relations);
</script>
</body>
</html>
