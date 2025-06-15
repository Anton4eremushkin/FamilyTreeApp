<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleUserFamilyTree extends Model
{
    use HasFactory;

    // Указываем таблицу, если она не следует по умолчанию (plural form)
    protected $table = 'role_user_family_tree';
    public $timestamps = false;

    // Разрешаем массовое присваивание для этих полей
    protected $fillable = [
        'user_id',
        'family_tree_id',
        'role_id', // вместо 'role' используем 'role_id', если у вас id роли
    ];

    // Дополнительные методы для отношений (если нужно)
    // Например, связь с моделью User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Связь с моделью FamilyTree
    public function familyTree()
    {
        return $this->belongsTo(FamilyTree::class);
    }

    // Связь с моделью Role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
