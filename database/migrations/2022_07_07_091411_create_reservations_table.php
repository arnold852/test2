<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('guesty_id');
            $table->longText('integration');
            $table->string('listingId');
            $table->string('source');
            $table->string('accountId');
            $table->string('status');
            $table->string('guestId');
            $table->longText('money');
            $table->string('checkIn');
            $table->string('checkOut');
            $table->string('createdAt');
            $table->longText('customFields');
            $table->longText('guest');
            $table->longText('listing');
            $table->boolean('saltoks_user_existed')->nullable();
            $table->boolean('saltoks_user_blocked')->nullable();
            $table->string('saltoks_user_id')->nullable();
            $table->boolean('accessGroupExist')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservations');
    }
}
