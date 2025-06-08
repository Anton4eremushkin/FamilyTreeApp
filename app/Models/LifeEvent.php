<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LifeEvent extends Model
{
    protected $table = 'life_event';
    public $timestamps = false;
    protected $guarded = [];

    // принадлежит персоне
    public function person()
    {
        return $this->belongsTo(Person::class);
    }

    // автор (пользователь)
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
