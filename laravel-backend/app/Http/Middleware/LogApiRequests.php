<?php

namespace App\Http\Middleware;

use App\Services\SplunkService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    public function __construct(
        private SplunkService $splunk
    ) {}

    public function handle(
        Request $request,
        Closure $next
    ): Response {

        $startTime = microtime(true);

        $response = $next($request);

        $responseTime = round(
            (microtime(true) - $startTime) * 1000,
            2
        );

        $this->splunk->send(
            $response->status() >= 400 ? 'ERROR' : 'INFO',
            'API request completed',
            [
                'method' => $request->method(),
                'endpoint' => $request->path(),
                'url' => $request->fullUrl(),
                'status_code' => $response->status(),
                'response_time_ms' => $responseTime,
                'ip' => $request->ip(),
                'user_id' => optional($request->user())->id,
            ]
        );

        return $response;
    }
}