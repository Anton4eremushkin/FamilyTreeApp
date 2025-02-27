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
        Schema::create('role_account_family_tree', function (Blueprint $table) {
            $table->integer('family_tree_id');
            $table->integer('account_id');
            $table->smallInteger('role_id');

            $table->primary(['family_tree_id', 'account_id']);
            $table->foreign('family_tree_id')->references('id')->on('family_tree')->onDelete('cascade');
            $table->foreign('account_id')->references('id')->on('account')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_account_family_tree');
    }
};
