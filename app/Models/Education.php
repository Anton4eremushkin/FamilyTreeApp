<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    public $timestamps = false;

    protected $table = 'education';

    protected $fillable = [
        'person_id',
        'education_type',
        'institution',
        'start_date',
        'start_date_text',
        'end_date',
        'end_date_text',
        'description',
    ];

    // Связь с персоной
    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }
}
