<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSiteUnitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('site_units', function (Blueprint $table) {
            $table->id();
            $table->integer('site_id')->unsigned();
            $table->string('unit_no');
            $table->integer('bedroom');
            $table->integer('bath');
            $table->boolean('entire_appartment');
            $table->string('nightly_min_stay');
            $table->string('type')->nullable();
            $table->double('sqft');
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
        Schema::dropIfExists('site_units');
    }
}
