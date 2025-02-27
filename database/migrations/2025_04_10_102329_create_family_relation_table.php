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
        Schema::create('family_relation', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('person_from');
            $table->bigInteger('person_to');
            $table->smallInteger('relation_type_id');

            $table->unique(['person_from', 'person_to']);
            $table->foreign('person_from')->references('id')->on('person')->onDelete('cascade');
            $table->foreign('person_to')->references('id')->on('person')->onDelete('cascade');
            $table->foreign('relation_type_id')->references('id')->on('relation_type');
        });

        Schema::table('family_relation', function (Blueprint $table) {
            $table->index('person_from', 'idx_family_relation_from');
            $table->index('person_to', 'idx_family_relation_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_relation');
    }
};
