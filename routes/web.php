<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FamilyTreeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PersonController;

use App\Http\Controllers\{
    MarriageController,
    EducationController,
    JobController,
    HealthRecordController
};

Route::get('/', HomeController::class)->name('home');

Route::get('/tree', function () { //Везде надо использовать вариант с '/family-tree/{id}', это для проверки
    return view('tree');
});

Route::middleware('auth')->group(function () {
    Route::get('/family-tree/create', [FamilyTreeController::class, 'create'])->name('family-tree.create');
    Route::post('/family-tree', [FamilyTreeController::class, 'store'])->name('family-tree.store');
    Route::get('/family-tree/{id}', [FamilyTreeController::class, 'show'])->name('family-tree.show');
});

Route::get('/register', [RegisterController::class, 'show'])->name('register.show');
Route::post('/register', [RegisterController::class, 'register'])->name('register.perform');

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.perform');


Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
})->name('logout');

Route::get('/person/{id}', [PersonController::class, 'show']);
Route::put('/person/{id}', [PersonController::class, 'update']);
Route::post('person', [PersonController::class, 'store']);
Route::delete('person/{id}', [PersonController::class, 'destroy']);

Route::post('/family_relation', [App\Http\Controllers\FamilyRelationController::class, 'store']);
Route::get('/person/family/{familyTreeId}', [PersonController::class, 'getByFamilyTree']);

// marriage
Route::get   ('person/{person}/marriage',  [MarriageController::class, 'index']);
Route::post  ('person/{person}/marriage',  [MarriageController::class, 'store']);
Route::put   ('marriage/{marriage}',       [MarriageController::class, 'update']);
Route::delete('marriage/{marriage}',       [MarriageController::class, 'destroy']);

// education
Route::get   ('person/{person}/education', [EducationController::class, 'index']);
Route::post  ('person/{person}/education', [EducationController::class, 'store']);
Route::put   ('education/{education}',     [EducationController::class, 'update']);
Route::delete('education/{education}',     [EducationController::class, 'destroy']);

// job
Route::get   ('person/{person}/job',       [JobController::class, 'index']);
Route::post  ('person/{person}/job',       [JobController::class, 'store']);
Route::put   ('job/{job}',                 [JobController::class, 'update']);
Route::delete('job/{job}',                 [JobController::class, 'destroy']);

// health-record
Route::get   ('person/{person}/health',    [HealthRecordController::class, 'index']);
Route::post  ('person/{person}/health',    [HealthRecordController::class, 'store']);
Route::put   ('health/{health_record}',    [HealthRecordController::class, 'update']);
Route::delete('health/{health_record}',    [HealthRecordController::class, 'destroy']);


