<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id('app_id');
            $table->string('name', 100);
            $table->string('code', 50)->nullable();
            $table->string('category', 60)->default('Akademik & Operasional');
            $table->text('description')->nullable();
            $table->string('api_key', 64)->unique();
            $table->string('trigger_condition', 120)->default('Setelah menyelesaikan aksi utama');
            $table->string('admin_email', 100)->default('admin-ti@telkomuniversity.ac.id');
            $table->integer('active_users')->default(1200);
            $table->timestamps();
        });

        Schema::create('feedback', function (Blueprint $table) {
            $table->id('feedback_id');
            $table->unsignedBigInteger('app_id');
            $table->string('user_id', 50);
            $table->string('user_name', 100)->nullable();
            $table->string('user_role', 50)->nullable();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('updated_at')->nullable();

            $table->foreign('app_id')->references('app_id')->on('applications')->onDelete('cascade');
            $table->index(['app_id', 'created_at']);
            $table->index('rating');
        });

        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->text('question_text');
            $table->enum('type', ['rating', 'text']);
            $table->integer('order_index')->default(1);
            $table->string('min_label', 50)->nullable();
            $table->string('max_label', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id('response_id');
            $table->unsignedBigInteger('feedback_id');
            $table->unsignedBigInteger('question_id');
            $table->text('answer');
            $table->timestamps();

            $table->foreign('feedback_id')->references('feedback_id')->on('feedback')->onDelete('cascade');
            $table->foreign('question_id')->references('question_id')->on('survey_questions')->onDelete('cascade');
        });

        Schema::create('early_warning_logs', function (Blueprint $table) {
            $table->id('warning_id');
            $table->unsignedBigInteger('app_id');
            $table->decimal('previous_avg', 4, 2);
            $table->decimal('current_avg', 4, 2);
            $table->decimal('drop_points', 4, 2);
            $table->string('recipient_email', 100);
            $table->text('message');
            $table->string('status', 30)->default('sent');
            $table->dateTime('detected_at');

            $table->foreign('app_id')->references('app_id')->on('applications')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('early_warning_logs');
        Schema::dropIfExists('survey_responses');
        Schema::dropIfExists('survey_questions');
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('applications');
    }
};
