<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LifeEvent;
use App\Models\Person;
use Illuminate\Http\Request;

class LifeEventController extends Controller
{
    /* список событий конкретной персоны */
    public function index(Person $person)
    {
        return $person->lifeEvents()->orderBy('created_at', 'desc')->get();
    }

    /* создание события */
    public function store(Request $request, Person $person)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $event = $person->lifeEvents()->create([
            'author_id'   => $request->user()->id ?? null,
            ...$data
        ]);

        return response()->json($event, 201);
    }

    /* обновление */
    public function update(Request $request, Person $person, LifeEvent $event)
    {
        abort_unless($event->person_id === $person->id, 404);

        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:100',
            'description' => 'sometimes|nullable|string',
        ]);

        $event->update($data);

        return $event;
    }

    /* удаление (если понадобится) */
    public function destroy(Person $person, LifeEvent $event)
    {
        abort_unless($event->person_id === $person->id, 404);
        $event->delete();

        return response()->noContent();
    }
}
