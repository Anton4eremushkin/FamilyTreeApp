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
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->Integer('person_id');
            $table->string('education_type', 50);
            $table->string('educational_institution', 256);
            $table->date('start_date')->nullable();
            $table->string('start_date_text', 64)->nullable();
            $table->date('end_date')->nullable();
            $table->string('end_date_text', 64)->nullable();
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
        Schema::dropIfExists('education');
    }
};
