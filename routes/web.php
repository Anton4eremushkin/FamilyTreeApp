<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\FamilyTreeController;
use App\Http\Controllers\PersonController;

Route::get('/', HomeController::class);

Route::resource('accounts', AccountController::class);

Route::resource('family-trees', FamilyTreeController::class);

Route::resource('people', PersonController::class);
