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
        Schema::create('medical_histories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('person_id');
            $table->string('disease_name', 128);
            $table->date('diagnosis_date')->nullable();
            $table->string('diagnosis_date_text', 64)->nullable();
            $table->string('medical_organization', 256)->nullable();
            $table->string('doctor_fullname', 128)->nullable();
            $table->string('description', 512)->nullable();

            $table->foreign('person_id')
                ->references('id')
                ->on('people')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_histories');
    }
};
