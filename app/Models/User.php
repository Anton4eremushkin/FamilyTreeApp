<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users'; // явно указываем таблицу

    protected $fillable = [
        'username',
        'email',
        'password',
        'url_img',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function roleInTree($treeId)
    {
        $relation = DB::table('role_user_family_tree')
            ->where('user_id', $this->id)
            ->where('family_tree_id', $treeId)
            ->join('role', 'role.id', '=', 'role_user_family_tree.role_id')
            ->select('role.name')
            ->first();

        return $relation ? $relation->name : 'guest';
    }

    public $timestamps = true; // created_at и updated_at есть, пусть остаются

    // Мутатор, чтобы автоматически хешировать пароль (опционально)
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
}
