<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    protected $table = 'applications';
    protected $primaryKey = 'app_id';

    protected $fillable = [
        'name',
        'code',
        'category',
        'description',
        'api_key',
        'trigger_condition',
        'admin_email',
        'active_users',
    ];

    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class, 'app_id', 'app_id');
    }

    public function earlyWarnings(): HasMany
    {
        return $this->hasMany(EarlyWarningLog::class, 'app_id', 'app_id');
    }
}
