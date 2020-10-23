<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrenciesTable extends Migration
{
    public function up()
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->char('iso', 3)->nullable(false);
            $table->string('name', 255)->nullable(false);
            $table->string('local_name', 255)->nullable(false)->default('');
            $table->string('symbol', 255)->nullable(false);
            $table->integer('unit_precision')->nullable(false)->default(2);
        });
    }

    public function down()
    {
        Schema::dropIfExists('currencies');
    }
}
