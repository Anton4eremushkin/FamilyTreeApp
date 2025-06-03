<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ValidationTest extends TestCase
{

    /** @test */
    public function it_validates_required_fields()
    {
        $response = $this->postJson('/api/person', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['full_name', 'birth_date']);
    }
}
