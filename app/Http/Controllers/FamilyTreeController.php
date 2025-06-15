<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\FamilyTree;
use App\Models\Role;
use App\Models\Person;
use Illuminate\Support\Facades\Validator;

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
                'role_id' => 1, // Создатель
            ]);

            // Создание персоны по умолчанию
            \App\Models\Person::create([
                'family_tree_id' => $tree->id,
                'full_name' => 'Ваше имя',
                'url_img' => 'default-user.png',
                'gender' => 'male',
                'birth_date' => null,
                'birth_date_text' => null,
                'birth_place' => null,
                'death_date' => null,
                'death_date_text' => null,
                'death_place' => null,
                'status' => 'living',
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

        $hasAccess = DB::table('role_user_family_tree')
            ->where('user_id', $user->id)
            ->where('family_tree_id', $id)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Нет доступа к этому древу');
        }

        $people = Person::where('family_tree_id', $id)->get();

        $relations = DB::table('family_relation')
            ->join('relation_type', 'family_relation.relation_type_id', '=', 'relation_type.id')
            ->select('person_from', 'person_to', 'relation_type.name as relation_type_name')
            ->whereIn('person_from', $people->pluck('id'))
            ->whereIn('person_to', $people->pluck('id'))
            ->get();

        $tree = \App\Models\FamilyTree::findOrFail($id);

        return view('tree', [
            'people' => $people,
            'relations' => $relations,
            'treeId' => $id,
            'treeName' => $tree->name,
        ]);
    }

    public function rename(Request $request, $id)
    {
        $user = Auth::user();

        $hasAccess = DB::table('role_user_family_tree')
            ->where('user_id', $user->id)
            ->where('family_tree_id', $id)
            ->where('role_id', 1) // Только создатель может переименовывать
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Нет прав на переименование');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Некорректное имя'], 422);
        }

        $tree = FamilyTree::findOrFail($id);
        $tree->name = $request->input('name');
        $tree->save();

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        $hasAccess = DB::table('role_user_family_tree')
            ->where('user_id', $user->id)
            ->where('family_tree_id', $id)
            ->where('role_id', 1)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Нет прав на удаление');
        }

        DB::transaction(function () use ($id) {
            // Получаем ID всех персон в древе
            $personIds = Person::where('family_tree_id', $id)->pluck('id');

            // Удаляем связи, где person_from или person_to принадлежат этому древу
            DB::table('family_relation')
                ->whereIn('person_from', $personIds)
                ->orWhereIn('person_to', $personIds)
                ->delete();

            // Удаляем персон из древа
            Person::where('family_tree_id', $id)->delete();

            // Удаляем связи пользователей с древом
            DB::table('role_user_family_tree')->where('family_tree_id', $id)->delete();

            // Удаляем само древо
            FamilyTree::destroy($id);
        });

        return response()->json(['success' => true]);
    }


}


