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
        Schema::create('account', function (Blueprint $table) {
            $table->id();
            $table->string('username', 64)->unique();
            $table->string('email', 256)->unique();
            $table->string('password', 256);
            $table->text('url_img')->default('');
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
        });

        Schema::table('account', function (Blueprint $table) {
            $table->index('username', 'idx_account_username');
            $table->index('email', 'idx_account_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account');
    }
};
