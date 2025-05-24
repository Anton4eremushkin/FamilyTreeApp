<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\FamilyTree;
use App\Models\Role;
use App\Models\Person;

class FamilyTreeController extends Controller
{
    public function create()
    {
        $user = Auth::user();
        // Проверка: уже ли привязан к какому-либо древу
        $existing = DB::table('role_user_family_tree')
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return redirect()->route('family-tree.show', ['id' => $existing->family_tree_id]);
        }

        return view('family_tree.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($request, $user) {


            $tree = FamilyTree::create([
                'name' => $request->name,
                'state' => 'active',
            ]);

            DB::table('role_user_family_tree')->insert([
                'user_id' => $user->id,
                'family_tree_id' => $tree->id,
                'role_id' => 1, // роль тут всегда admin, потому что этот человек создает древо
            ]);


        });

        // Получаем ID дерева, к которому привязан пользователь
        $tree_id = DB::table('role_user_family_tree')
            ->where('user_id', $user->id)
            ->value('family_tree_id');

        return redirect()->route('family-tree.show', ['id' => $tree_id]);
    }

    public function show(Request $request, $id)
    {
        $user = Auth::user();

        // Проверка: есть ли у пользователя доступ к этому древу
        $hasAccess = DB::table('role_user_family_tree')
            ->where('user_id', $user->id)
            ->where('family_tree_id', $id)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Нет доступа к этому древу');
        }

        // Получаем всех людей, принадлежащих этому древу
        $people = Person::where('family_tree_id', $id)->get();

        return view('tree', compact('people'));
    }
}


