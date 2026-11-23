<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use App\Services\SplunkService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function __construct(
        private SplunkService $splunk
    ) {

    }                            

    public function sendOtp(Request $request)
    {
        $request->merge([
            'email' => trim((string) $request->input('email', '')),
        ]);

        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Generate 6-digit OTP
        $otp = random_int(100000, 999999);

        // Delete old OTPs for this email
        Otp::where('email', $email)->delete();

        // Save new OTP in database
        Otp::create([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);

        // Send OTP email
        Mail::send(
            'emails.otp',
            [
                'otp' => $otp,
            ],
            function ($message) use ($email) {

                $message->from(
                    config('mail.from.address'),
                    'Corporates Guide LMS'
                );

                $message->to($email);

                $message->subject(
                    'Corporates Guide LMS Your LMS Login OTP'
                );
            }
        );
$this->splunk->send(
    'INFO',
    'OTP sent successfully',
    [
        'event' => 'OTP_SENT',
        'email' => $email,
        'ip' => $request->ip()
    ]
);
        return response()->json([
            'message' => 'OTP sent successfully',
        ]);
    }


    // ==========================================
    // VERIFY OTP
    // ==========================================

    public function verifyOtp(Request $request)
    {
        $request->merge([
            'email' => trim((string) $request->input('email', '')),
        ]);

        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $email = $request->email;
        $otp = $request->otp;

        // Find matching OTP
        $otpRecord = Otp::where('email', $email)
            ->where('otp', $otp)
            ->first();

        // OTP is incorrect
if (!$otpRecord) {

    $this->splunk->send(
        'WARNING',
        'Invalid OTP verification attempt',
        [
            'event' => 'OTP_VERIFY_FAILED',
            'email' => $email,
            'ip' => $request->ip(),
            'reason' => 'invalid_otp'
        ]
    );

    return response()->json([
        'message' => 'Invalid OTP',
    ], 422);
}

        // Check OTP expiry
     if (now()->greaterThan($otpRecord->expires_at)) {

    $this->splunk->send(
        'WARNING',
        'OTP verification failed - OTP expired',
        [
            'event' => 'OTP_VERIFY_FAILED',
            'email' => $email,
            'ip' => $request->ip(),
            'reason' => 'otp_expired'
        ]
    );

    $otpRecord->delete();

    return response()->json([
        'message' => 'OTP has expired',
    ], 422);
}

        // OTP is correct
        $otpRecord->delete();

        // Check if user already exists
        $user = User::where('email', $email)->first();

        // ==========================================
        // NEW USER
        // ==========================================

        if (!$user) {

            return response()->json([
                'message' => 'OTP verified successfully',
                'access_token' => null,
                'is_new_user' => true,
                'user' => null,
            ]);
        }

        // ==========================================
        // EXISTING USER
        // ==========================================

        $accessToken = $user
            ->createToken('lms-token')
            ->plainTextToken;

        return response()->json([
            'message' => 'OTP verified successfully',
            'access_token' => $accessToken,
            'is_new_user' => false,
            'user' => $user,
        ]);
    }


    // ==========================================
    // REGISTER USER
    // ==========================================

    public function register(Request $request)
    {
        $request->merge([
            'email' => trim((string) $request->input('email', '')),
            'phone' => trim((string) $request->input('phone', '')),
        ]);

        // Validate registration data
        $data = $request->validate([
            'email' => ['required', 'email'],
            'name' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date'],
            'organization' => ['required', 'string', 'max:255'],
            'organization_type' => ['required', 'in:college,company'],
            'phone' => ['required', 'string', 'max:20', 'regex:/^(?=(?:.*\d){7,15}$)\+?[0-9\s().-]+$/'],
        ]);

        $user = User::firstOrNew([
            'email' => $data['email'],
        ]);
        $user->fill([
            'name' => $user->exists ? $user->name : $data['name'],
            'dob' => $data['dob'],
            'organization' => $data['organization'],
            'organization_type' => $data['organization_type'],
            'phone' => $user->exists ? $user->phone : $data['phone'],
        ]);
        $user->save();

        // Create login token
        $accessToken = $user
            ->createToken('lms-token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'access_token' => $accessToken,
            'user' => $user,
        ]);
    }
}