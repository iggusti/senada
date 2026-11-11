<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\EarlyWarningLog;
use App\Models\Feedback;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        EarlyWarningLog::truncate();
        SurveyResponse::truncate();
        SurveyQuestion::truncate();
        Feedback::truncate();
        Application::truncate();
        Schema::enableForeignKeyConstraints();

        $pilotApps = [
            [
                'name' => 'Portal Akademik',
                'code' => 'portal-akademik',
                'category' => 'Layanan Akademik Utama',
                'description' => 'Sistem informasi akademik terpadu untuk registrasi mata kuliah, jadwal perkuliahan, kartu studi, dan transkrip nilai civitas Telkom University.',
                'api_key' => 'snd_live_portal_akademik_telu_2026_key01',
                'trigger_condition' => 'Setelah simpan KSM / Cetak KHS / Lihat Nilai',
                'admin_email' => 'akademik-ti@telkomuniversity.ac.id',
                'active_users' => 1850,
            ],
            [
                'name' => 'Sistem Keuangan',
                'code' => 'sistem-keuangan',
                'category' => 'Administrasi & Pembayaran',
                'description' => 'Platform pengelolaan tagihan BPP/UKT mahasiswa, verifikasi pembayaran virtual account, dan pelaporan anggaran unit kerja.',
                'api_key' => 'snd_live_sistem_keuangan_telu_2026_key02',
                'trigger_condition' => 'Setelah unduh invoice atau konfirmasi pembayaran',
                'admin_email' => 'keuangan-ti@telkomuniversity.ac.id',
                'active_users' => 1120,
            ],
            [
                'name' => 'E-Learning LMS',
                'code' => 'elearning-lms',
                'category' => 'Pembelajaran Digital (CeLOE)',
                'description' => 'Learning Management System untuk akses materi kuliah, pengumpulan tugas, kuis interaktif, dan forum diskusi daring.',
                'api_key' => 'snd_live_elearning_lms_telu_2026_key03',
                'trigger_condition' => 'Setelah submit tugas atau menyelesaikan kuis',
                'admin_email' => 'celoe-ti@telkomuniversity.ac.id',
                'active_users' => 2100,
            ],
            [
                'name' => 'Sistem Absensi',
                'code' => 'sistem-absensi',
                'category' => 'SDM & Presensi Perkuliahan',
                'description' => 'Aplikasi pencatatan kehadiran pegawai dan presensi QR-code perkuliahan mahasiswa secara real-time.',
                'api_key' => 'snd_live_sistem_absensi_telu_2026_key04',
                'trigger_condition' => 'Setelah check-in / check-out presensi harian',
                'admin_email' => 'sdm-ti@telkomuniversity.ac.id',
                'active_users' => 980,
            ],
            [
                'name' => 'Repository Digital',
                'code' => 'repository-digital',
                'category' => 'Perpustakaan & Publikasi Ilmiah',
                'description' => 'Pusat arsip tugas akhir, jurnal ilmiah, dan koleksi buku digital OpenLibrary Telkom University.',
                'api_key' => 'snd_live_repository_digital_telu_2026_key05',
                'trigger_condition' => 'Setelah unduh dokumen karya ilmiah atau unggah TA',
                'admin_email' => 'openlib-ti@telkomuniversity.ac.id',
                'active_users' => 840,
            ],
        ];

        $apps = [];
        foreach ($pilotApps as $appData) {
            $apps[] = Application::create($appData);
        }

        $questionsData = [
            [
                'question_text' => 'Seberapa mudah aplikasi ini digunakan?',
                'type' => 'rating',
                'order_index' => 1,
                'min_label' => 'Sangat Sulit',
                'max_label' => 'Sangat Mudah',
            ],
            [
                'question_text' => 'Bagaimana kualitas fitur-fitur aplikasi?',
                'type' => 'rating',
                'order_index' => 2,
                'min_label' => 'Sangat Buruk',
                'max_label' => 'Sangat Baik',
            ],
            [
                'question_text' => 'Bagaimana kecepatan aplikasi?',
                'type' => 'rating',
                'order_index' => 3,
                'min_label' => 'Sangat Lambat',
                'max_label' => 'Sangat Cepat',
            ],
            [
                'question_text' => 'Apa keluhan utama Anda?',
                'type' => 'text',
                'order_index' => 4,
                'min_label' => null,
                'max_label' => null,
            ],
            [
                'question_text' => 'Apa saran pengembangan untuk aplikasi ini ke depannya?',
                'type' => 'text',
                'order_index' => 5,
                'min_label' => null,
                'max_label' => null,
            ],
        ];

        $questions = [];
        foreach ($questionsData as $qData) {
            $questions[] = SurveyQuestion::create($qData);
        }

        $users = [
            ['id' => '26970004', 'name' => 'Ilham Gumantung Gusti', 'role' => 'Ketua Pengusul / TI Strategis'],
            ['id' => '26980012', 'name' => 'Riky Faza', 'role' => 'Tim Pengembang TI'],
            ['id' => '26980019', 'name' => 'Yulio Ferdinand', 'role' => 'Tim Pengembang TI'],
            ['id' => '26990024', 'name' => 'Aryo Yusuf Dinanda', 'role' => 'Product & UX Analyst'],
            ['id' => '26990031', 'name' => 'Amira Nur Khalipah', 'role' => 'Quality Assurance TI'],
            ['id' => '22900021', 'name' => 'Rio Guntur Utomo', 'role' => 'Pimpinan Direktorat'],
            ['id' => '1301223011', 'name' => 'Nadia Putri Pratama', 'role' => 'Mahasiswa Informatika'],
            ['id' => '1202220045', 'name' => 'Bagas Adi Nugroho', 'role' => 'Mahasiswa Sistem Informasi'],
            ['id' => '1101221089', 'name' => 'Citra Maharani', 'role' => 'Mahasiswa Teknik Telekomunikasi'],
            ['id' => '1401224012', 'name' => 'Dimas Wahyu Saputra', 'role' => 'Mahasiswa MBTI'],
            ['id' => '19880412', 'name' => 'Dr. Hendra Kurniawan', 'role' => 'Dosen Fakultas Informatika'],
            ['id' => '19910823', 'name' => 'Siti Rahmawati, M.T.', 'role' => 'Dosen Fakultas Rekayasa Industri'],
        ];

        $positiveComments = [
            'Tampilan antarmuka sangat bersih, responsif, dan mudah dipahami saat akses jadwal kuliah.',
            'Kecepatan loading halaman sangat cepat dan integrasi login SSO otomatis sangat membantu.',
            'Fitur pencarian dokumen dan unduh berkas berjalan stabil tanpa kendala.',
            'Sangat terbantu dengan notifikasi status pengumpulan tugas yang real-time dan akurat.',
            'Navigasi menu jelas dan proses cetak kartu studi jauh lebih praktis dibanding sebelumnya.',
            'Pengalaman pengguna sangat nyaman, desain modern dan informasi nilai langsung sinkron.',
        ];

        $keuanganRecentComplaints = [
            'Sinkronisasi status pembayaran tagihan virtual account lambat dan loading halaman invoice sering timeout.',
            'Halaman verifikasi tagihan UKT sering error 500 saat jam sibuk dan loading sangat berat.',
            'Status pembayaran belum berubah otomatis padahal sudah transfer, mohon perbaikan sinkronisasi data.',
            'Unduh bukti pembayaran PDF gagal berkali-kali dan waktu respon server sangat lambat.',
            'Tabel rincian tagihan kurang responsif di layar mobile dan proses cek status terlalu lama.',
        ];

        $absensiRecentComplaints = [
            'Pemindaian QR code presensi sering gagal dan lokasi GPS lambat terdeteksi saat jam masuk kuliah.',
            'Aplikasi presensi sering logout sendiri padahal sesi SSO masih aktif, loading rekap kehadiran lama.',
            'Server absensi terasa berat dan macet ketika banyak kelas melakukan presensi bersamaan pukul 08.00.',
            'Data riwayat kehadiran terlambat sinkron dengan jadwal pengganti perkuliahan.',
            'Tombol konfirmasi hadir kadang tidak merespons dan muncul pesan error koneksi server.',
        ];

        $createdCount = 0;

        foreach ($apps as $index => $app) {
            for ($dayOffset = 28; $dayOffset >= 0; $dayOffset--) {
                $entriesPerDay = ($dayOffset <= 10) ? 2 : 1;

                for ($e = 0; $e < $entriesPerDay; $e++) {
                    $user = $users[($createdCount + $dayOffset + $index) % count($users)];
                    $createdAt = now()->subDays($dayOffset)->subHours(($e * 5) + ($index % 4))->subMinutes(15);

                    $isRecent7Days = $dayOffset < 7;

                    if ($app->code === 'sistem-keuangan') {
                        if ($isRecent7Days) {
                            $rating = ($e % 2 === 0) ? 2 : 3;
                            $comment = $keuanganRecentComplaints[($dayOffset + $e) % count($keuanganRecentComplaints)];
                        } else {
                            $rating = ($dayOffset % 3 === 0) ? 5 : 4;
                            $comment = $positiveComments[($dayOffset + $e) % count($positiveComments)];
                        }
                    } elseif ($app->code === 'sistem-absensi') {
                        if ($isRecent7Days) {
                            $rating = ($dayOffset % 2 === 0) ? 2 : 3;
                            $comment = $absensiRecentComplaints[($dayOffset + $e) % count($absensiRecentComplaints)];
                        } else {
                            $rating = ($dayOffset % 2 === 0) ? 4 : 5;
                            $comment = $positiveComments[($dayOffset + $e) % count($positiveComments)];
                        }
                    } else {
                        $rating = ($dayOffset % 5 === 0) ? 4 : 5;
                        $comment = $positiveComments[($dayOffset + $index + $e) % count($positiveComments)];
                    }

                    $fb = Feedback::create([
                        'app_id' => $app->app_id,
                        'user_id' => $user['id'],
                        'user_name' => $user['name'],
                        'user_role' => $user['role'],
                        'rating' => $rating,
                        'comment' => $comment,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    if ($createdCount % 3 === 0) {
                        SurveyResponse::create([
                            'feedback_id' => $fb->feedback_id,
                            'question_id' => $questions[0]->question_id,
                            'answer' => (string) max(1, min(5, $rating)),
                        ]);
                        SurveyResponse::create([
                            'feedback_id' => $fb->feedback_id,
                            'question_id' => $questions[1]->question_id,
                            'answer' => (string) max(1, min(5, $rating === 5 ? 5 : $rating + 1)),
                        ]);
                        SurveyResponse::create([
                            'feedback_id' => $fb->feedback_id,
                            'question_id' => $questions[2]->question_id,
                            'answer' => (string) $rating,
                        ]);
                        SurveyResponse::create([
                            'feedback_id' => $fb->feedback_id,
                            'question_id' => $questions[3]->question_id,
                            'answer' => $comment,
                        ]);
                        SurveyResponse::create([
                            'feedback_id' => $fb->feedback_id,
                            'question_id' => $questions[4]->question_id,
                            'answer' => $rating <= 3
                                ? 'Mohon optimasi performa query database dan percepat sinkronisasi API pada jam sibuk.'
                                : 'Pertahankan kecepatan akses dan tambahkan mode gelap pada antarmuka.',
                        ]);
                    }

                    $createdCount++;
                }
            }
        }

        EarlyWarningLog::create([
            'app_id' => $apps[1]->app_id,
            'previous_avg' => 4.35,
            'current_avg' => 2.50,
            'drop_points' => 1.85,
            'recipient_email' => $apps[1]->admin_email,
            'message' => 'PERINGATAN DINI SENADA: Rating aplikasi "Sistem Keuangan" turun 1.85 poin dalam 7 hari terakhir (dari 4.35 menjadi 2.50) akibat kendala sinkronisasi virtual account dan loading invoice.',
            'status' => 'sent_email',
            'detected_at' => now()->subHours(5),
        ]);

        EarlyWarningLog::create([
            'app_id' => $apps[3]->app_id,
            'previous_avg' => 4.46,
            'current_avg' => 2.43,
            'drop_points' => 2.03,
            'recipient_email' => $apps[3]->admin_email,
            'message' => 'PERINGATAN DINI SENADA: Rating aplikasi "Sistem Absensi" turun 2.03 poin dalam 7 hari terakhir (dari 4.46 menjadi 2.43) akibat kendala pemindaian QR code dan lonjakan trafik jam masuk kuliah.',
            'status' => 'sent_email',
            'detected_at' => now()->subHours(2),
        ]);
    }
}
