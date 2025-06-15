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
                    'role' => $item->role_id,
                ];
            });

        return response()->json($users);
    }

    public function toggleRole(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'familyTreeId' => 'required|integer|exists:family_tree,id',
        ]);

        $relation = RoleUserFamilyTree::where('user_id', $validated['userId'])
            ->where('family_tree_id', $validated['familyTreeId'])
            ->first();

        if (!$relation) {
            return response()->json(['error' => 'Связь не найдена'], 404);
        }

        if ($relation->role_id === 3) {
            $newRole = 2; // пользователь -> исследователь
        } elseif ($relation->role_id === 2) {
            $newRole = 3; // исследователь -> пользователь
        } else {
            return response()->json(['error' => 'Нельзя изменить роль создателя'], 403);
        }

        RoleUserFamilyTree::where('user_id', $validated['userId'])
            ->where('family_tree_id', $validated['familyTreeId'])
            ->update(['role_id' => $newRole]);

        return response()->json(['message' => 'Роль обновлена']);
    }

    public function removeUser(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'familyTreeId' => 'required|integer|exists:family_tree,id',
        ]);

        $relation = RoleUserFamilyTree::where('user_id', $validated['userId'])
            ->where('family_tree_id', $validated['familyTreeId'])
            ->first();

        if (!$relation) {
            return response()->json(['error' => 'Связь не найдена'], 404);
        }

        if ($relation->role_id === 1) {
            return response()->json(['error' => 'Нельзя удалить создателя древа'], 403);
        }

        RoleUserFamilyTree::where('user_id', $validated['userId'])
            ->where('family_tree_id', $validated['familyTreeId'])
            ->delete();

        return response()->json(['message' => 'Пользователь удалён из древа']);
    }
}
