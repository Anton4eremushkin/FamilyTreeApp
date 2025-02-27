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
        Schema::create('family_tree', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->enum('state', ['private', 'public', 'archived']);
            $table->timestampsTz();
        });

        Schema::table('family_tree', function (Blueprint $table) {
            $table->index('state', 'idx_family_tree_state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_tree');
    }
};
