<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AuthEmailNormalizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_otp_trims_spaces_from_a_valid_email_address(): void
    {
        Mail::fake();
        Http::fake();

        $this->postJson('/api/auth/send-otp', [
            'email' => '  student@example.com  ',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'OTP sent successfully');

        $this->assertDatabaseHas('otps', [
            'email' => 'student@example.com',
        ]);
        $this->assertDatabaseMissing('otps', [
            'email' => '  student@example.com  ',
        ]);
    }
}
