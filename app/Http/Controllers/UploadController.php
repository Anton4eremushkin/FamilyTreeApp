<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class UploadController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->hasFile('image')) {
            return response('No file uploaded', 400);
        }

        $path = $request->file('image')->store('', 'public');
        return response()->json([
            'url' => basename($path),
        ]);
    }
}
