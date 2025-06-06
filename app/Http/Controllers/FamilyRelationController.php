<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\FamilyRelation;

class FamilyRelationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_from'      => 'required|integer|exists:person,id',
            'person_to'        => 'required|integer|exists:person,id',
            'relation_type_id' => ['required', 'integer', Rule::in([6,7,8,10])],
        ]);

        $relation = FamilyRelation::create($validated);

        return response()->json($relation, 201);
    }
}
