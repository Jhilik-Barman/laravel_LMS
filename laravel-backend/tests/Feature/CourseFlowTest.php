<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_user_cannot_enroll_in_a_second_course(): void
    {
        $user = User::factory()->create([
            'enrolled_courses' => ['frontend-development'],
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/user/enroll', [
            'course_slug' => 'backend-development',
        ]);

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'You can only enroll in one course.',
            ]);
        $this->assertSame(['frontend-development'], $user->fresh()->enrolled_courses);
    }

    public function test_user_can_upload_and_replace_a_profile_picture(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $firstResponse = $this->actingAs($user, 'sanctum')->post('/api/user/profile-picture', [
            'profile_picture' => UploadedFile::fake()->createWithContent(
                'first.png',
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+nmS8AAAAASUVORK5CYII='),
            ),
        ]);

        $firstResponse->assertOk();
        $firstPicturePath = substr(
            parse_url($firstResponse->json('profile_picture'), PHP_URL_PATH),
            strlen('/storage/'),
        );
        Storage::disk('public')->assertExists($firstPicturePath);

        $secondResponse = $this->post('/api/user/profile-picture', [
            'profile_picture' => UploadedFile::fake()->createWithContent(
                'second.png',
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+nmS8AAAAASUVORK5CYII='),
            ),
        ]);

        $secondResponse->assertOk();
        $secondPicturePath = substr(
            parse_url($secondResponse->json('profile_picture'), PHP_URL_PATH),
            strlen('/storage/'),
        );

        Storage::disk('public')->assertMissing($firstPicturePath);
        Storage::disk('public')->assertExists($secondPicturePath);
        $this->assertSame($secondResponse->json('profile_picture'), $user->fresh()->profile_picture);
    }
}
