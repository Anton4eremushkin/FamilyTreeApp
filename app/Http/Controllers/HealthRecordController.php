<?php

namespace App\Http\Controllers;

use App\Models\MedicalHistory;
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
    public function index($personId)
    {
        $records = MedicalHistory::where('person_id', $personId)
            ->orderBy('diagnosis_date')
            ->get();

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:person,id',
            'disease_name' => 'required|string|max:128',
            'diagnosis_date' => 'nullable|date',
            'diagnosis_date_text' => 'nullable|string|max:32',
            'medical_organization' => 'nullable|string|max:128',
            'doctor_fullname' => 'nullable|string|max:128',
            'description' => 'nullable|string|max:512',
        ]);

        $record = MedicalHistory::create($validated);

        return response()->json($record, 201);
    }

    public function update(Request $request, MedicalHistory $healthRecord)
    {
        $validated = $request->validate([
            'disease_name' => 'sometimes|required|string|max:128',
            'diagnosis_date' => 'nullable|date',
            'diagnosis_date_text' => 'nullable|string|max:32',
            'medical_organization' => 'nullable|string|max:128',
            'doctor_fullname' => 'nullable|string|max:128',
            'description' => 'nullable|string|max:512',
        ]);

        $healthRecord->update($validated);

        return response()->json($healthRecord);
    }

    public function destroy(MedicalHistory $healthRecord)
    {
        $healthRecord->delete();
        return response()->json(null, 204);
    }
}
