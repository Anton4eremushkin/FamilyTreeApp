<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{

    protected $table = 'person';
    protected $fillable = [
        'family_tree_id',
        'url_img',
        'full_name',
        'gender',
        'birth_date',
        'birth_date_text',
        'birth_place',
        'death_date',
        'death_date_text',
        'death_place',
        'status',
    ];


}
