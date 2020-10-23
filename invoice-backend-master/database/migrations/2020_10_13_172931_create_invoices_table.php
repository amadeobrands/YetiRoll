<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->timestamp('finalized_at')->nullable(true)->default(null);
            $table->bigInteger('user_id')->nullable(false);
            $table->string('title', 255)->nullable(false);
            $table->bigInteger('currency_id')->nullable(false);

            $table->date('due_date')->nullable(true)->default(null);
            $table->string('local_id', 255)->nullable(false)->default('');

            $table->string('author_name', 255)->nullable(false)->default('');
            $table->string('author_address_first_line', 255)->nullable(false)->default('');
            $table->string('author_address_second_line', 255)->nullable(false)->default('');
            $table->char('author_country_iso_code', 3)->nullable(false)->default('');

            $table->string('recipient_name', 255)->nullable(false)->default('');
            $table->string('recipient_address_first_line', 255)->nullable(false)->default('');
            $table->string('recipient_address_second_line', 255)->nullable(false)->default('');
            $table->char('recipient_country_iso_code', 3)->nullable(false)->default('');

            $table->text('note')->nullable(false)->default('');
            $table->text('terms')->nullable(false)->default('');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('currency_id')->references('id')->on('currencies');
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
