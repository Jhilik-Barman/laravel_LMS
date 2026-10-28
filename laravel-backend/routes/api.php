<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

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

    Route::post('/user/profile-picture', function (Request $request) {
        $data = $request->validate([
            'profile_picture' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $previousPicturePath = $user->profile_picture
            ? parse_url($user->profile_picture, PHP_URL_PATH)
            : null;
        $path = $data['profile_picture']->store("profile-pictures/{$user->id}", 'public');

        $user->profile_picture = Storage::disk('public')->url($path);
        $user->save();

        if (is_string($previousPicturePath) && str_starts_with($previousPicturePath, '/storage/')) {
            Storage::disk('public')->delete(substr($previousPicturePath, strlen('/storage/')));
        }

        return response()->json($user->fresh());
    });

    Route::post('/user/enroll', function (Request $request) {
        $data = $request->validate([
            'course_slug' => ['required', 'string', 'max:255'],
        ]);

        $slug = trim($data['course_slug']);

        return DB::transaction(function () use ($request, $slug) {
            $user = User::query()
                ->whereKey($request->user()->getKey())
                ->lockForUpdate()
                ->firstOrFail();
            $enrolled = $user->enrolled_courses ?? [];

            if (in_array($slug, $enrolled, true)) {
                return response()->json($user);
            }

            if ($enrolled !== []) {
                return response()->json([
                    'message' => 'You can only enroll in one course.',
                ], 409);
            }

            $user->enrolled_courses = [$slug];
            $user->save();

            return response()->json($user->fresh());
        });
    });
});

// Send OTP
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);

// Verify OTP
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

Route::post('/auth/register', [AuthController::class, 'register']);
