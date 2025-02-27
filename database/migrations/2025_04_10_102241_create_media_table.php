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
        Schema::create('media', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('uploader_id')->nullable();
            $table->text('url')->default('');
            $table->enum('media_type', ['photo', 'video', 'audio', 'document']);
            $table->timestampTz('uploaded_at')->useCurrent();
            $table->timestampTz('created_at')->nullable();
            $table->string('place', 128)->nullable();
            $table->string('note', 256)->nullable();

            $table->foreign('uploader_id')->references('id')->on('account')->onDelete('set null');
        });

        Schema::table('media', function (Blueprint $table) {
            $table->index('media_type', 'idx_media_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
