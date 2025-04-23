<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;

class PersonFilter extends AbstractFilter
{
    public const FULLNAME = 'fullname';
    protected function getCallbacks(): array
    {
        return [
            self::FULLNAME => [$this, 'fullname']
        ];
    }

    public function fullname(Builder $builder, $value): void
    {
        $builder->where('fullname', 'like', '%{$value}p%');
    }
}
