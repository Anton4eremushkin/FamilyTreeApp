<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalHistory extends Model
{
    public $timestamps = false;

    protected $table = 'health_record';

    protected $fillable = [
        'person_id',
        'disease_name',
        'diagnosis_date',
        'diagnosis_date_text',
        'medical_organization',
        'doctor_fullname',
        'description',
    ];

    // Связь с персоной
    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }
}
