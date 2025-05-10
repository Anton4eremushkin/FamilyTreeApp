<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __invoke() : View
    {
        return view('welcome');
    }

    public function redirectAfterLogin()
    {
        $user = auth()->user();

        if ($user->familyTree) {
            return redirect()->route('family-tree.show', $user->familyTree->id);
        } else {
            return redirect()->route('family-tree.create');
        }
    }
}
