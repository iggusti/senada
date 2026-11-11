<?php

namespace App\Http\Controllers;

use App\Models\SurveyQuestion;
use Illuminate\Http\JsonResponse;

class SurveyController extends Controller
{
    public function questions(): JsonResponse
    {
        $questions = SurveyQuestion::orderBy('order_index', 'asc')->get([
            'question_id',
            'question_text',
            'type',
            'order_index',
            'min_label',
            'max_label',
        ]);

        return response()->json($questions);
    }
}
