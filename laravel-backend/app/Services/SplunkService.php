<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SplunkService
{
    public function send(
        string $level,
        string $message,
        array $data = []
    ): void {
        $requestId = request()->header('X-Request-ID')
            ?: (string) Str::uuid();

        $payload = [
            'time' => microtime(true),

            'host' => gethostname(),

            'source' => 'laravel-lms',

            'sourcetype' => env(
                'SPLUNK_SOURCETYPE',
                'lms:app'
            ),

            'index' => env(
                'SPLUNK_INDEX',
                'lms_logs'
            ),

            'event' => [
                'application' => 'lms',

                'environment' => app()->environment(),

                'level' => $level,

                'message' => $message,

                'request_id' => $requestId,

                'data' => $data
            ]
        ];

        try {
             $response = Http::withOptions([
    'verify' => false,
])
    ->timeout(5)
    ->withHeaders([
        'Authorization' =>
            'Splunk ' . config('services.splunk.token'),
        'Content-Type' => 'application/json',
    ])
    ->post(
        config('services.splunk.url'),
        $payload
    );

            if (!$response->successful()) {
                \Log::error(
                    'Splunk HEC returned an error',
                    [
                        'status' => $response->status(),
                        'response' => $response->body()
                    ]
                );
            }

        } catch (\Throwable $e) {

            \Log::error(
                'Splunk HEC connection failed',
                [
                    'error' => $e->getMessage()
                ]
            );
        }
    }
}