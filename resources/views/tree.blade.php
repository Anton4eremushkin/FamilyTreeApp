<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('storage/favicon.png') }}">


    <title>Моя Родословная</title>
    @viteReactRefresh
    @vite(['resources/css/app.tree.css', 'resources/js/tree.jsx'])
</head>
<body>
<div class="tree-view">


    <div class="tree-canvas">
        <div id="react-flow-root" style="width: 100%; height: 100vh;"></div>
    </div>
</div>

<script>
    // Передаем данные с Blade в React
    window.peopleData = @json($people);
    window.relationData = @json($relations);
    window.userRole = @json(auth()->user()?->roleInTree($treeId) ?? 'guest');
    window.familyTreeId = @json($treeId);
</script>


</body>
</html>
