<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyTree extends Model
{

    use HasFactory;
    // Указываем таблицу
    protected $table = 'family_tree';

    // Указываем, какие поля можно заполнять
    protected $fillable = ['name', 'state'];

    public function familyTree()
    {
        return $this->hasOne(FamilyTree::class);
    }
}
