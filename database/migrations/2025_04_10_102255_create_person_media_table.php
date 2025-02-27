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
        Schema::create('person_media', function (Blueprint $table) {
            $table->bigInteger('person_id');
            $table->bigInteger('media_id');

            $table->primary(['person_id', 'media_id']);
            $table->foreign('person_id')->references('id')->on('person')->onDelete('cascade');
            $table->foreign('media_id')->references('id')->on('media')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('person_media');
    }
};
