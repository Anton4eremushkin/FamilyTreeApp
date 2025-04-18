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
        Schema::create('family_relations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('person_from');
            $table->bigInteger('person_to');
            $table->smallInteger('relation_type_id');
            $table->timestamps();

            $table->unique(['person_from', 'person_to']);

            $table->foreign('person_from')
                ->references('id')
                ->on('people')
                ->onDelete('cascade');

            $table->foreign('person_to')
                ->references('id')
                ->on('people')
                ->onDelete('cascade');

            $table->foreign('relation_type_id')
                ->references('id')
                ->on('relation_types');
        });

        Schema::create('family_relation_closures', function (Blueprint $table) {
            $table->bigInteger('ancestor');
            $table->bigInteger('descendant');
            $table->integer('depth');

            $table->primary(['ancestor', 'descendant']);

            $table->foreign('ancestor')
                ->references('id')
                ->on('people')
                ->onDelete('cascade');

            $table->foreign('descendant')
                ->references('id')
                ->on('people')
                ->cascadeOnDelete();

            $table->index('descendant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_relation_closures');
        Schema::dropIfExists('family_relations');
    }
};
