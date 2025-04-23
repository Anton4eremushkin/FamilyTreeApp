<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Account extends Authenticatable
{
    use HasFactory, Notifiable;

    // Указываем таблицу явно (если имя нестандартное)
    protected $table = 'account';

    protected $fillable = [
        'username',
        'email',
        'password',
        'url_img',
    ];

    protected $hidden = [
        'password',
    ];
}

