<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    public function index(): JsonResponse
    {
        $apps = Application::withCount('feedback')
            ->withAvg('feedback', 'rating')
            ->orderBy('app_id', 'asc')
            ->get()
            ->map(function (Application $app) {
                $recent7 = $app->feedback()
                    ->where('created_at', '>=', now()->subDays(7))
                    ->avg('rating');

                $prev7 = $app->feedback()
                    ->whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])
                    ->avg('rating');

                $recentAvg = $recent7 !== null ? round((float) $recent7, 2) : round((float) ($app->feedback_avg_rating ?? 0), 2);
                $prevAvg = $prev7 !== null ? round((float) $prev7, 2) : $recentAvg;
                $drop = round($prevAvg - $recentAvg, 2);

                return [
                    'app_id' => $app->app_id,
                    'name' => $app->name,
                    'code' => $app->code,
                    'category' => $app->category,
                    'description' => $app->description,
                    'api_key' => $app->api_key,
                    'trigger_condition' => $app->trigger_condition,
                    'admin_email' => $app->admin_email,
                    'active_users' => $app->active_users,
                    'avg_rating' => round((float) ($app->feedback_avg_rating ?? 0), 2),
                    'recent_7d_rating' => $recentAvg,
                    'previous_7d_rating' => $prevAvg,
                    'rating_drop_7d' => $drop,
                    'has_early_warning' => $drop > 0.5,
                    'total_feedback' => (int) $app->feedback_count,
                ];
            });

        return response()->json($apps);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:60',
            'description' => 'required|string|max:500',
            'trigger_condition' => 'required|string|max:120',
            'admin_email' => 'required|email|max:100',
            'active_users' => 'nullable|integer|min:10',
        ]);

        $app = Application::create([
            'name' => $validated['name'],
            'code' => $validated['code'] ?? Str::slug($validated['name']),
            'category' => $validated['category'] ?? 'Layanan Internal Kampus',
            'description' => $validated['description'],
            'api_key' => 'snd_live_' . Str::lower(Str::random(32)),
            'trigger_condition' => $validated['trigger_condition'],
            'admin_email' => $validated['admin_email'],
            'active_users' => $validated['active_users'] ?? 500,
        ]);

        Cache::flush();

        return response()->json([
            'status' => 'success',
            'message' => 'Aplikasi berhasil didaftarkan ke SENADA.',
            'data' => $app,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $app = Application::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|required|string|max:500',
            'trigger_condition' => 'sometimes|required|string|max:120',
            'admin_email' => 'sometimes|required|email|max:100',
        ]);

        $app->update($validated);
        Cache::flush();

        return response()->json([
            'status' => 'success',
            'message' => 'Konfigurasi aplikasi berhasil diperbarui.',
            'data' => $app,
        ]);
    }
}
