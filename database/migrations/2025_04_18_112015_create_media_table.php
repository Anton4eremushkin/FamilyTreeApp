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
            $table->id();
            $table->Integer('uploader_id', )->nullable();
            $table->Integer('person_id', );
            $table->Integer('life_event_id')->nullable();
            $table->text('url')->default('');
            $table->enum('media_type', ['photo', 'video', 'audio', 'document']);
            $table->string('place', 256)->nullable();
            $table->string('note', 128)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('uploaded_at')->useCurrent();

            $table->foreign('uploader_id')
                ->references('id')
                ->on('accounts')
                ->onDelete('set null');
            $table->foreign('person_id')
                ->references('id')
                ->on('people')
                ->cascadeOnDelete();
            $table->foreign('life_event_id')
                ->references('id')
                ->on('life_events')
                ->onDelete('set null');

            $table->index('media_type');
            $table->index('person_id');
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
