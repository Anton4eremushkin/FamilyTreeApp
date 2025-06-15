<?php

namespace App\Http\Controllers;

use App\Models\RoleUserFamilyTree;
use Illuminate\Http\Request;

class RoleUserFamilyTreeController extends Controller
{
    public function getByFamilyTree($familyTreeId)
    {
        $users = RoleUserFamilyTree::with('user')
            ->where('family_tree_id', $familyTreeId)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->user->id,
                    'name' => $item->user->username,
                    'role' => $item->role_id, // можно заменить на $item->role->name, если нужна роль текстом
                ];
            });

        return response()->json($users);
    }

    public function toggleRole(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'familyTreeId' => 'required|integer|exists:family_trees,id',
        ]);

        $relation = RoleUserFamilyTree::where('user_id', $validated['userId'])
            ->where('family_tree_id', $validated['familyTreeId'])
            ->first();

        if (!$relation) {
            return response()->json(['error' => 'Связь не найдена'], 404);
        }

        if ($relation->role === 3) {
            $relation->role = 2; // пользователь -> исследователь
        } elseif ($relation->role === 2) {
            $relation->role = 3; // исследователь -> пользователь
        } else {
            return response()->json(['error' => 'Нельзя изменить роль создателя'], 403);
        }

        $relation->save();

        return response()->json(['message' => 'Роль обновлена']);
    }

    public function removeUser(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'familyTreeId' => 'required|integer|exists:family_trees,id',
        ]);

        $relation = RoleUserFamilyTree::where('user_id', $validated['userId'])
            ->where('family_tree_id', $validated['familyTreeId'])
            ->first();

        if (!$relation) {
            return response()->json(['error' => 'Связь не найдена'], 404);
        }

        if ($relation->role === 1) {
            return response()->json(['error' => 'Нельзя удалить создателя древа'], 403);
        }

        $relation->delete();

        return response()->json(['message' => 'Пользователь удалён из древа']);
    }

}
