<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marriage extends Model
{
    public $timestamps = false;

    protected $table = 'marriage';

    protected $fillable = [
        'person1_id',
        'premarital_surname1',
        'person2_id',
        'premarital_surname2',
        'type',
        'begin_date',
        'begin_date_text',
        'end_date',
        'end_date_text',
        'end_reason',
        'place',
        'description',
    ];

    // Связь с первой персоной (человеком)
    public function person1()
    {
        return $this->belongsTo(Person::class, 'person1_id');
    }

    // Связь со второй персоной (человеком)
    public function person2()
    {
        return $this->belongsTo(Person::class, 'person2_id');
    }
}
