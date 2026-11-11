<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SurveyController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:100,1')->group(function () {
    Route::post('/feedback/quick', [FeedbackController::class, 'storeQuick']);
    Route::post('/feedback/extended', [FeedbackController::class, 'storeExtended']);
    Route::get('/survey/questions', [SurveyController::class, 'questions']);
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/app/{id}', [DashboardController::class, 'appDetail']);
    Route::get('/apps', [ApplicationController::class, 'index']);
    Route::post('/apps', [ApplicationController::class, 'store']);
    Route::put('/apps/{id}', [ApplicationController::class, 'update']);
    Route::post('/early-warning/check', [DashboardController::class, 'runEarlyWarningCheck']);
});
