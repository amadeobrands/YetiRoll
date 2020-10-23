<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoiceItemsTable extends Migration
{
    public function up()
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger('invoice_id')->nullable(false);
            $table->string('name', 255)->nullable(false);
            $table->integer('quantity')->nullable(false)->default(0);
            $table->double('price_per_unit')->nullable(false)->default(0.0);

            $table->foreign('invoice_id')->references('id')->on('invoices');
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoice_items');
    }
}
