<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FamilyTreeController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/family-trees', [FamilyTreeController::class, 'index']);
