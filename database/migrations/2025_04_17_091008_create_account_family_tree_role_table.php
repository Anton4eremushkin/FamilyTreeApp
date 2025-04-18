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
        Schema::create('account_family_tree_role', function (Blueprint $table) {
            $table->bigInteger('family_tree_id', 'false', 'true');
            $table->bigInteger('account_id', 'false', 'true');
            $table->smallInteger('role_id');

            $table->primary(['family_tree_id', 'account_id']);
            $table->foreign('family_tree_id')
                ->references('id')
                ->on('family_trees')
                ->cascadeOnDelete();
            $table->foreign('account_id')
                ->references('id')
                ->on('accounts')
                ->cascadeOnDelete();
            $table->foreign('role_id')
                ->references('id')
                ->on('roles');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_family_tree_role');
    }
};
