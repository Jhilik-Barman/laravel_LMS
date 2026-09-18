<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/courses', [CourseController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/user/me', function (Request $request) {
        return $request->user();
    });

    Route::put('/user/me', function (Request $request) {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'dob' => ['sometimes', 'nullable', 'date'],
            'organization' => ['sometimes', 'nullable', 'string', 'max:255'],
            'organization_type' => ['sometimes', 'nullable', 'in:college,company'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'profile_picture' => ['sometimes', 'nullable', 'string'],
        ]);

        $user->fill($data);
        $user->save();

        return response()->json($user->fresh());
    });

    Route::post('/user/enroll', function (Request $request) {
        $data = $request->validate([
            'course_slug' => ['required', 'string', 'max:255'],
        ]);

        $slug = trim($data['course_slug']);
        $user = $request->user();
        $enrolled = $user->enrolled_courses ?? [];

        if (!in_array($slug, $enrolled, true)) {
            $enrolled[] = $slug;
            $user->enrolled_courses = $enrolled;
            $user->save();
        }

        return response()->json($user->fresh());
    });
});

// Send OTP
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);

// Verify OTP
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

Route::post('/auth/register', [AuthController::class, 'register']);