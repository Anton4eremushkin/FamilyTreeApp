<?php

namespace Tests\Unit;

use App\Models\FamilyTree;
use App\Models\Person;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FamilyTreeTest extends TestCase
{
    use RefreshDatabase;

    public function test_person_can_be_added_to_family_tree()
    {
        $tree = FamilyTree::factory()->create();
        $person = Person::factory()->create();

        $tree->people()->attach($person->id);

        $this->assertTrue($tree->people->contains($person));
    }

    public function test_family_tree_can_have_multiple_people()
    {
        $tree = FamilyTree::factory()->create();
        $people = Person::factory(3)->create();

        $tree->people()->attach($people->pluck('id'));

        $this->assertCount(3, $tree->people);
    }
}
