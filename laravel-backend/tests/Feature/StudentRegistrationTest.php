<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class StudentRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_requires_a_valid_phone_number(): void
    {
        $this->postJson('/api/auth/register', [
            'email' => 'student@example.com',
            'name' => 'Sample Student',
            'dob' => '2000-01-01',
            'organization' => 'Example College',
            'organization_type' => 'college',
            'phone' => '123456',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('phone');

        $this->postJson('/api/auth/register', [
            'email' => 'student@example.com',
            'name' => 'Sample Student',
            'dob' => '2000-01-01',
            'organization' => 'Example College',
            'organization_type' => 'college',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('phone');

        $this->assertDatabaseMissing('users', ['email' => 'student@example.com']);
    }

    public function test_registration_saves_phone_and_returns_the_student_profile(): void
    {
        $this->postJson('/api/auth/register', [
            'email' => 'student@example.com',
            'name' => 'Sample Student',
            'dob' => '2000-01-01',
            'organization' => 'Example College',
            'organization_type' => 'college',
            'phone' => ' +1 (555) 123-4567 ',
        ])
            ->assertOk()
            ->assertJsonPath('user.name', 'Sample Student')
            ->assertJsonPath('user.phone', '+1 (555) 123-4567');

        $this->assertDatabaseHas('users', [
            'email' => 'student@example.com',
            'phone' => '+1 (555) 123-4567',
        ]);
    }

    public function test_registration_does_not_change_an_existing_students_name(): void
    {
        $user = User::factory()->create([
            'email' => 'student@example.com',
            'name' => 'Original Student',
            'phone' => '5550001234',
        ]);

        $this->postJson('/api/auth/register', [
            'email' => 'student@example.com',
            'name' => 'Changed Student',
            'dob' => '2000-01-01',
            'organization' => 'Example College',
            'organization_type' => 'college',
            'phone' => '5551234567',
        ])
            ->assertOk()
            ->assertJsonPath('user.name', 'Original Student')
            ->assertJsonPath('user.phone', '5550001234');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Original Student',
            'phone' => '5550001234',
        ]);
    }

    public function test_profile_api_does_not_allow_name_or_phone_updates(): void
    {
        $user = User::factory()->create([
            'phone' => '5551234567',
        ]);
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withToken($token)
            ->putJson('/api/user/me', [
                'name' => 'Updated Student',
                'phone' => '+1 555 123 4567',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('phone');

        $this->withToken($token)
            ->getJson('/api/user/me')
            ->assertOk()
            ->assertJsonPath('name', $user->name);

        $this->withToken($token)
            ->putJson('/api/user/me', [
                'name' => 'Updated Student',
                'organization' => 'Updated College',
            ])
            ->assertOk()
            ->assertJsonPath('name', $user->name)
            ->assertJsonPath('phone', '5551234567');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => $user->name,
            'phone' => '5551234567',
            'organization' => 'Updated College',
        ]);
    }

    public function test_phone_column_is_not_nullable(): void
    {
        $phoneColumn = collect(Schema::getColumns('users'))
            ->firstWhere('name', 'phone');

        $this->assertNotNull($phoneColumn);
        $this->assertFalse($phoneColumn['nullable']);
    }
}
