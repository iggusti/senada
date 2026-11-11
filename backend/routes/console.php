<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('senada:check-early-warning')->dailyAt('07:00');
