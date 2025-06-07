<?php

namespace App\Http\Controllers;

use App\Models\Marriage;
use Illuminate\Http\Request;

class MarriageController extends Controller
{
    public function index($personId)
    {
        // Получаем все браки, где person1_id или person2_id равны $personId
        $marriages = Marriage::where('person1_id', $personId)
            ->orWhere('person2_id', $personId)
            ->get();

        return response()->json($marriages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person1_id' => 'required|exists:person,id',
            'premarital_surname1' => 'nullable|string|max:64',
            'person2_id' => 'required|exists:person,id',
            'premarital_surname2' => 'nullable|string|max:64',
            'type' => 'required|in:legal,civil,cherch',
            'begin_date' => 'required|date',
            'begin_date_text' => 'nullable|string|max:32',
            'end_date' => 'nullable|date',
            'end_date_text' => 'nullable|string|max:32',
            'end_reason' => 'nullable|in:divorce,death,annulment',
            'place' => 'nullable|string|max:128',
            'description' => 'nullable|string|max:512',
        ]);

        $marriage = Marriage::create($validated);

        return response()->json($marriage, 201);
    }

    public function update(Request $request, Marriage $marriage)
    {
        $validated = $request->validate([
            'premarital_surname1' => 'nullable|string|max:64',
            'premarital_surname2' => 'nullable|string|max:64',
            'type' => 'sometimes|required|in:legal,civil,cherch',
            'begin_date' => 'sometimes|required|date',
            'begin_date_text' => 'nullable|string|max:32',
            'end_date' => 'nullable|date',
            'end_date_text' => 'nullable|string|max:32',
            'end_reason' => 'nullable|in:divorce,death,annulment',
            'place' => 'nullable|string|max:128',
            'description' => 'nullable|string|max:512',
        ]);

        $marriage->update($validated);

        return response()->json($marriage);
    }

    public function destroy(Marriage $marriage)
    {
        $marriage->delete();
        return response()->json(null, 204);
    }
}

