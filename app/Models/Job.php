<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    public $timestamps = false;

    protected $table = 'job';

    protected $fillable = [
        'person_id',
        'position',
        'place',
        'start_date',
        'start_date_text',
        'end_date',
        'end_date_text',
        'work_experience',
        'description',
    ];

    // Связь с персоной
    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }
}
