<?php

namespace App\Http\Controllers;

use App\Models\Education;
use App\Models\FamilyRelation;
use App\Models\Job;
use App\Models\Marriage;
use App\Models\MedicalHistory;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PersonController extends Controller
{
    // Получить данные персоны по ID
    public function show($id)
    {
        $person = Person::find($id);

        if (!$person) {
            return response()->json(['error' => 'Person not found'], 404);
        }

        return response()->json($person);
    }

    // Обновить данные персоны
    public function update(Request $request, $id)
    {
        $person = Person::find($id);

        if (!$person) {
            return response()->json(['error' => 'Person not found'], 404);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:128',
            'url_img' => 'required|string',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'birth_date' => 'nullable|date',
            'birth_date_text' => 'nullable|string|max:32',
            'birth_place' => 'nullable|string|max:128',
            'death_date' => 'nullable|date',
            'death_date_text' => 'nullable|string|max:32',
            'death_place' => 'nullable|string|max:128',
            'status' => ['required', Rule::in(['living', 'deceased', 'unknown'])],
        ]);

        $person->update($validated);

        return response()->json($person);
    }

    // Создать новую персону
    public function store(Request $request)
    {
        $validated = $request->validate([
            'family_tree_id' => 'required|integer|exists:family_tree,id',
            'full_name' => 'required|string|max:128',
            'url_img' => 'required|string',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'birth_date' => 'nullable|date',
            'birth_date_text' => 'nullable|string|max:32',
            'birth_place' => 'nullable|string|max:128',
            'death_date' => 'nullable|date',
            'death_date_text' => 'nullable|string|max:32',
            'death_place' => 'nullable|string|max:128',
            'status' => ['required', Rule::in(['living', 'deceased', 'unknown'])],
        ]);

        $person = Person::create($validated);

        return response()->json($person, 201);
    }

    public function getByFamilyTree($familyTreeId)
    {
        return response()->json(
            Person::where('family_tree_id', $familyTreeId)->get()
        );
    }

    public function destroy($id)
    {

        $person = Person::find($id);

        if (!$person) {
            return response()->json(['error' => 'Person not found'], 404);
        }

        FamilyRelation::where('person_from', $id)->orWhere('person_to', $id)->delete();

        $person->delete();

        return response()->json(null, 204);
    }

    public function education()    { return $this->hasMany(Education::class); }
    public function jobs()         { return $this->hasMany(Job::class); }
    public function healthRecords(){ return $this->hasMany(MedicalHistory::class); }
    public function marriagesAs1() { return $this->hasMany(Marriage::class,'person1_id'); }
    public function marriagesAs2() { return $this->hasMany(Marriage::class,'person2_id'); }

}
