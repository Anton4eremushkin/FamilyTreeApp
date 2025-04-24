<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
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

    public $timestamps = true; // created_at и updated_at есть, пусть остаются

    // Мутатор, чтобы автоматически хешировать пароль (опционально)
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
}
