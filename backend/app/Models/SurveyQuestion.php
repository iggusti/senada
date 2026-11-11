<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyQuestion extends Model
{
    protected $table = 'survey_questions';
    protected $primaryKey = 'question_id';

    protected $fillable = [
        'question_text',
        'type',
        'order_index',
        'min_label',
        'max_label',
    ];

    protected $casts = [
        'order_index' => 'integer',
    ];

    public function responses(): HasMany
    {
        return $this->hasMany(SurveyResponse::class, 'question_id', 'question_id');
    }
}
