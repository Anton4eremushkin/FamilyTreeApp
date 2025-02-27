<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('person_id');
            $table->string('position', 128);
            $table->string('place', 128)->nullable();
            $table->date('start_date')->nullable();
            $table->string('start_date_text', 32)->nullable();
            $table->date('end_date')->nullable();
            $table->string('end_date_text', 32)->nullable();
            $table->string('work_experience', 8)->nullable();
            $table->string('description', 512)->nullable();

            $table->foreign('person_id')->references('id')->on('person')->onDelete('cascade');
        });

        Schema::table('job', function (Blueprint $table) {
            $table->index('person_id', 'idx_job_person');
            $table->index('start_date', 'idx_job_start_date');
            $table->index('end_date', 'idx_job_end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job');
    }
};
