<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EarlyWarningLog extends Model
{
    protected $table = 'early_warning_logs';
    protected $primaryKey = 'warning_id';
    public $timestamps = false;

    protected $fillable = [
        'app_id',
        'previous_avg',
        'current_avg',
        'drop_points',
        'recipient_email',
        'message',
        'status',
        'detected_at',
    ];

    protected $casts = [
        'previous_avg' => 'float',
        'current_avg' => 'float',
        'drop_points' => 'float',
        'detected_at' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'app_id', 'app_id');
    }
}
