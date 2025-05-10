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
        Schema::rename('role_account_family_tree', 'role_user_family_tree');
    }

    public function down(): void
    {
        Schema::rename('role_user_family_tree', 'role_account_family_tree');
    }

};
