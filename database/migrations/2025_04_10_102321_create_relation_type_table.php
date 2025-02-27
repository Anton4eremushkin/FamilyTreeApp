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
        Schema::create('relation_type', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 64)->unique();
            $table->integer('degree')->default(1);
            $table->boolean('is_directed');
            $table->string('reverse_name', 64)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relation_type');
    }
};
