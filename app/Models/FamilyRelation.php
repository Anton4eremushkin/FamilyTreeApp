<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyRelation extends Model
{
    protected $table = 'family_relation';
    public $timestamps = false;

    protected $fillable = [
        'person_from',       // ← оставить родные имена
        'person_to',
        'relation_type_id',
    ];
}
