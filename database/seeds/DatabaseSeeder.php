<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // https://github.com/fzaninotto/Faker
        $faker = Faker\Factory::create();

        \App\User::create([
            'name' => 'test',
            'email' => 'admin@thepropolis.com',
            'email_verified_at' => now(),
            'password' => bcrypt('ThePropolis2022'),
            'remember_token' => Str::random(10),
            'role' => 'Admin'
        ]);

    }
}
