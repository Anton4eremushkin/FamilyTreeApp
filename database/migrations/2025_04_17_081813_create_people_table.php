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
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('family_tree_id','false','true');
            $table->text('url_img')->default('');
            $table->string('full_name', 128);
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('birth_date')->nullable();
            $table->string('birth_date_text', 64)->nullable();
            $table->string('birth_place', 128)->nullable();
            $table->date('death_date')->nullable();
            $table->string('death_date_text', 64)->nullable();
            $table->string('death_place', 128)->nullable();
            $table->enum('status', ['living', 'deceased', 'unknown']);
            $table->string('short_biography', 512)->nullable();
            $table->timestamps();

            $table->foreign('family_tree_id')
                ->references('id')
                ->on('family_trees')
                ->cascadeOnDelete();

            $table->index('full_name');
            $table->index('status');
            $table->index(['birth_date', 'death_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
