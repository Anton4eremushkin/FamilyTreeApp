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
        Schema::create('life_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('person_id');
            $table->integer('author_id')->nullable();
            $table->date('date')->nullable();
            $table->string('date_text', 64)->nullable();
            $table->string('title', 64);
            $table->string('description',4096);
            $table->timestamps();

            $table->foreign('person_id')
                ->references('id')
                ->on('people')
                ->cascadeOnDelete();
            $table->foreign('author_id')
                ->references('id')
                ->on('accounts')
                ->nullOnDelete();

            $table->index('title');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('life_events');
    }
};
