<?php

namespace App\Console\Commands;

use App\Http\Controllers\DashboardController;
use Illuminate\Console\Command;

class CheckEarlyWarningCommand extends Command
{
    protected $signature = 'senada:check-early-warning';
    protected $description = 'Deteksi penurunan rating > 0.5 poin dalam 7 hari dan kirim notifikasi email ke admin aplikasi';

    public function handle(DashboardController $dashboardController): int
    {
        $response = $dashboardController->runEarlyWarningCheck();
        $payload = $response->getData(true);

        $this->info($payload['message'] ?? 'Pemeriksaan Early Warning selesai.');

        return self::SUCCESS;
    }
}
