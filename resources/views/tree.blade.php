<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Моя Родословная</title>
    @vite('resources/css/app.tree.css')
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
        <div class="canvas-wrapper" id="viewport">
            <div id="canvas">
                <div class="node" style="left: 100px; top: 100px; position: absolute;">Женщина</div>
                <div class="line" style="left: 222px; top: 170px; position: absolute;"></div>
                <div class="node" style="left: 300px; top: 100px; position: absolute;">Мужчина</div>
            </div>
        </div>

        <div class="canvas-controls">
            <button>🎤</button>
            <button>⚙️</button>
            <button>👤</button>
            <button id="zoom-in">＋</button>
            <button id="zoom-out">－</button>
        </div>
    </div>
</div>

<script>
    const viewport = document.getElementById('viewport');
    const canvas = document.getElementById('canvas');

    let isPanning = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;
    let scale = 1;

    viewport.addEventListener('mousedown', (e) => {
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        viewport.style.cursor = 'grabbing';
    });

    viewport.addEventListener('mouseup', () => {
        isPanning = false;
        viewport.style.cursor = 'grab';
    });

    viewport.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        scale *= zoomFactor;
        updateTransform();
    });

    document.getElementById('zoom-in').addEventListener('click', () => {
        scale *= 1.1;
        updateTransform();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        scale *= 0.9;
        updateTransform();
    });

    function updateTransform() {
        canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
</script>
</body>
</html>
