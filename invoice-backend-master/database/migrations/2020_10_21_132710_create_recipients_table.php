<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecipientsTable extends Migration
{
    public function up()
    {
        Schema::create('recipients', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger('user_id')->nullable(false);
            $table->string('name', 255)->nullable(false);
            $table->string('address_first_line', 255)->nullable(false)->default("");
            $table->string('address_second_line', 255)->nullable(false)->default("");
            $table->char('country_iso_code', 3)->nullable(false)->default("");
            $table->string('email', 255)->nullable(false)->default("");

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('recipients');
    }
}
