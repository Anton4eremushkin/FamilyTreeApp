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
        Schema::create('health_record', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('person_id');
            $table->string('disease_name', 128);
            $table->date('diagnosis_date')->nullable();
            $table->string('diagnosis_date_text', 32)->nullable();
            $table->string('medical_organization', 128)->nullable();
            $table->string('doctor_fullname', 128)->nullable();
            $table->string('description', 512)->nullable();

            $table->foreign('person_id')->references('id')->on('person')->onDelete('cascade');
        });

        Schema::table('health_record', function (Blueprint $table) {
            $table->index('person_id', 'idx_health_record_person');
            $table->index('disease_name', 'idx_health_record_disease');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_record');
    }
};
