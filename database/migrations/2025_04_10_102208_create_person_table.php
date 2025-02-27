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
        Schema::create('person', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('family_tree_id');
            $table->text('url_img')->default('');
            $table->string('full_name', 128);
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('birth_date')->nullable();
            $table->string('birth_date_text', 32)->nullable();
            $table->string('birth_place', 128)->nullable();
            $table->date('death_date')->nullable();
            $table->string('death_date_text', 32)->nullable();
            $table->string('death_place', 128)->nullable();
            $table->enum('status', ['living', 'deceased', 'unknown']);
            $table->string('biography', 512)->nullable();
            $table->timestampsTz();

            $table->foreign('family_tree_id')->references('id')->on('family_tree')->onDelete('cascade');
        });

        Schema::table('person', function (Blueprint $table) {
            $table->index('family_tree_id', 'idx_person_family_tree');
            $table->index('full_name', 'idx_person_name');
            $table->index('birth_date', 'idx_person_birth_date');
            $table->index('death_date', 'idx_person_death_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('person');
    }
};
