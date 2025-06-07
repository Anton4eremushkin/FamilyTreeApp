<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:person,id',
            'position' => 'required|string|max:128',
            'place' => 'nullable|string|max:128',
            'start_date' => 'nullable|date',
            'start_date_text' => 'nullable|string|max:32',
            'end_date' => 'nullable|date',
            'end_date_text' => 'nullable|string|max:32',
            'work_experience' => 'nullable|string|max:8',
            'description' => 'nullable|string|max:512',
        ]);

        $job = Job::create($validated);

        return response()->json($job, 201);
    }

    public function update(Request $request, Job $job)
    {
        $validated = $request->validate([
            'position' => 'sometimes|required|string|max:128',
            'place' => 'nullable|string|max:128',
            'start_date' => 'nullable|date',
            'start_date_text' => 'nullable|string|max:32',
            'end_date' => 'nullable|date',
            'end_date_text' => 'nullable|string|max:32',
            'work_experience' => 'nullable|string|max:8',
            'description' => 'nullable|string|max:512',
        ]);

        $job->update($validated);

        return response()->json($job);
    }

    public function destroy(Job $job)
    {
        $job->delete();
        return response()->json(null, 204);
    }
}
