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
        Schema::create('marriages', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('person1_id');
            $table->string('premarital_surname1', 64)->nullable();
            $table->bigInteger('person2_id');
            $table->string('premarital_surname2', 64)->nullable();
            $table->enum('type', ['civil', 'religious']);
            $table->date('begin_date');
            $table->string('begin_date_text', 32)->nullable();
            $table->string('conclusion_place', 128)->nullable();
            $table->date('end_date')->nullable();
            $table->string('end_date_text', 32)->nullable();
            $table->enum('end_reason', ['divorce', 'death', 'annulment'])->nullable();
            $table->string('dissolution_place', 128)->nullable();
            $table->string('description', 512)->nullable();

            $table->foreign('person1_id')
                ->references('id')
                ->on('people')
                ->cascadeOnDelete();
            $table->foreign('person2_id')
                ->references('id')
                ->on('people')
                ->cascadeOnDelete();

            $table->index(['person1_id', 'person2_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marriages');
    }
};
