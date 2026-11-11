<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Feedback;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function storeQuick(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'app_id' => 'required|integer|exists:applications,app_id',
            'user_id' => 'nullable|string|max:50',
            'user_name' => 'nullable|string|max:100',
            'user_role' => 'nullable|string|max:50',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if (Feedback::count() >= 10000) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kapasitas maksimum prototype (10.000 record feedback) telah tercapai.',
            ], 422);
        }

        $apiKey = $request->header('X-API-Key');
        if ($apiKey) {
            $app = Application::where('app_id', $validated['app_id'])->first();
            if ($app && $app->api_key !== $apiKey) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'API Key aplikasi tidak valid.',
                ], 401);
            }
        }

        $ssoUserId = $validated['user_id'] ?? $request->header('X-SSO-User-Id', '26970004');
        $ssoUserName = $validated['user_name'] ?? $request->header('X-SSO-User-Name', 'Ilham Gumantung Gusti');
        $ssoUserRole = $validated['user_role'] ?? $request->header('X-SSO-User-Role', 'Pegawai TI');

        $feedback = Feedback::create([
            'app_id' => $validated['app_id'],
            'user_id' => $ssoUserId,
            'user_name' => $ssoUserName,
            'user_role' => $ssoUserRole,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Cache::flush();

        return response()->json([
            'status' => 'success',
            'message' => 'Quick feedback berhasil disimpan.',
            'data' => $feedback->load('application'),
        ], 201);
    }

    public function storeExtended(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'feedback_id' => 'nullable|integer|exists:feedback,feedback_id',
            'app_id' => 'nullable|integer|exists:applications,app_id',
            'user_id' => 'nullable|string|max:50',
            'user_name' => 'nullable|string|max:100',
            'user_role' => 'nullable|string|max:50',
            'responses' => 'required|array|min:1',
            'responses.*.question_id' => 'required|integer|exists:survey_questions,question_id',
            'responses.*.answer' => 'required',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $feedbackId = $validated['feedback_id'] ?? null;

            if (!$feedbackId) {
                $appId = $validated['app_id'] ?? Application::first()?->app_id ?? 1;
                $ratingAnswers = [];
                $textComments = [];

                $questionsById = SurveyQuestion::pluck('type', 'question_id');
                foreach ($validated['responses'] as $item) {
                    $qType = $questionsById[$item['question_id']] ?? 'text';
                    if ($qType === 'rating' && is_numeric($item['answer'])) {
                        $ratingAnswers[] = (int) $item['answer'];
                    } elseif ($qType === 'text' && !empty(trim((string) $item['answer']))) {
                        $textComments[] = trim((string) $item['answer']);
                    }
                }

                $calculatedRating = count($ratingAnswers) > 0
                    ? (int) round(array_sum($ratingAnswers) / count($ratingAnswers))
                    : 4;

                $feedback = Feedback::create([
                    'app_id' => $appId,
                    'user_id' => $validated['user_id'] ?? $request->header('X-SSO-User-Id', '26970004'),
                    'user_name' => $validated['user_name'] ?? $request->header('X-SSO-User-Name', 'Ilham Gumantung Gusti'),
                    'user_role' => $validated['user_role'] ?? $request->header('X-SSO-User-Role', 'Pegawai TI'),
                    'rating' => max(1, min(5, $calculatedRating)),
                    'comment' => count($textComments) > 0 ? implode(' | ', $textComments) : 'Mengisi survei lanjutan lengkap.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $feedbackId = $feedback->feedback_id;
            } else {
                $feedback = Feedback::find($feedbackId);
            }

            SurveyResponse::where('feedback_id', $feedbackId)->delete();

            $savedResponses = [];
            $textSummary = [];

            foreach ($validated['responses'] as $item) {
                $answerStr = trim((string) $item['answer']);
                if ($answerStr === '') {
                    continue;
                }

                $savedResponses[] = SurveyResponse::create([
                    'feedback_id' => $feedbackId,
                    'question_id' => $item['question_id'],
                    'answer' => $answerStr,
                ]);

                if (!is_numeric($answerStr)) {
                    $textSummary[] = $answerStr;
                }
            }

            if ($feedback && empty($feedback->comment) && count($textSummary) > 0) {
                $feedback->update([
                    'comment' => implode(' — ', $textSummary),
                ]);
            }

            Cache::flush();

            return response()->json([
                'status' => 'success',
                'message' => 'Jawaban survei lanjutan berhasil disimpan.',
                'feedback_id' => $feedbackId,
                'saved_count' => count($savedResponses),
            ], 201);
        });
    }
}
