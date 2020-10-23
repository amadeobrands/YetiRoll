<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoiceTemplatesTable extends Migration
{
    public function up()
    {
        Schema::create('invoice_templates', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->string('title', 255)->nullable(false);
            $table->bigInteger('user_id')->nullable(false);
            $table->bigInteger('recipient_id')->nullable(true)->default(null);
            $table->bigInteger('currency_id')->nullable(false);

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('recipient_id')->references('id')->on('recipients');
            $table->foreign('currency_id')->references('id')->on('currencies');
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoice_templates');
    }
}
