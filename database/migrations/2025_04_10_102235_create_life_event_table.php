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
        Schema::create('life_event', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('person_id');
            $table->integer('author_id')->nullable();
            $table->date('event_date')->nullable();
            $table->string('event_date_text', 32)->nullable();
            $table->string('title', 100);
            $table->text('description');
            $table->timestampsTz();

            $table->foreign('person_id')->references('id')->on('person')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('account')->onDelete('set null');
        });

        Schema::table('life_event', function (Blueprint $table) {
            $table->index('person_id', 'idx_life_event_person');
            $table->index('event_date', 'idx_life_event_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('life_event');
    }
};
