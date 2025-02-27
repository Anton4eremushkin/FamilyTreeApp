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
        Schema::create('marriage', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('person1_id');
            $table->string('premarital_surname1', 64)->nullable();
            $table->bigInteger('person2_id');
            $table->string('premarital_surname2', 64)->nullable();
            $table->enum('type', ['legal', 'civil', 'church']);
            $table->date('begin_date');
            $table->string('begin_date_text', 32)->nullable();
            $table->date('end_date')->nullable();
            $table->string('end_date_text', 32)->nullable();
            $table->enum('end_reason', ['divorce', 'death', 'annulment'])->nullable();
            $table->string('place', 128)->nullable();
            $table->string('description', 512)->nullable();

            $table->foreign('person1_id')->references('id')->on('person')->onDelete('cascade');
            $table->foreign('person2_id')->references('id')->on('person')->onDelete('cascade');
        });

        Schema::table('marriage', function (Blueprint $table) {
            $table->index('person1_id', 'idx_marriage_person1');
            $table->index('person2_id', 'idx_marriage_person2');
            $table->index(['begin_date', 'end_date'], 'idx_marriage_dates');
            $table->index('begin_date', 'idx_marriage_begin_date');
            $table->index('end_date', 'idx_marriage_end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marriage');
    }
};
