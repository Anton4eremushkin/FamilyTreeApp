<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index($personId)
    {
        return response()->json(Education::where('person_id', $personId)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:person,id',
            'education_type' => 'required|string|max:50',
            'institution' => 'required|string|max:128',
            'start_date' => 'nullable|date',
            'start_date_text' => 'nullable|string|max:32',
            'end_date' => 'nullable|date',
            'end_date_text' => 'nullable|string|max:32',
            'description' => 'nullable|string|max:512',
        ]);

        $education = Education::create($validated);
        return response()->json($education, 201);
    }

    public function update(Request $request, Education $education)
    {
        $validated = $request->validate([
            'education_type' => 'required|string|max:50',
            'institution' => 'required|string|max:128',
            'start_date' => 'nullable|date',
            'start_date_text' => 'nullable|string|max:32',
            'end_date' => 'nullable|date',
            'end_date_text' => 'nullable|string|max:32',
            'description' => 'nullable|string|max:512',
        ]);

        $education->update($validated);
        return response()->json($education);
    }

    public function destroy(Education $education)
    {
        $education->delete();
        return response()->json(null, 204);
    }
}


