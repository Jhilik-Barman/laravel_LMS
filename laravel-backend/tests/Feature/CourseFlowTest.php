<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_courses_endpoint_returns_course_catalogue(): void
    {
        $response = $this->getJson('/api/courses');

        $response->assertOk();
        $response->assertJsonStructure([
            '*' => [
                'slug',
                'title',
                'description',
                'duration',
                'certificate',
                'placement_support',
            ],
        ]);
    }

    public function test_user_can_enroll_in_a_course(): void
    {
        $user = User::factory()->create([
            'email' => 'student@example.com',
            'name' => 'Alice Student',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/user/enroll', [
            'course_slug' => 'frontend-development',
        ]);

        $response->assertOk();
        $this->assertContains('frontend-development', $user->fresh()->enrolled_courses ?? []);
    }
}
