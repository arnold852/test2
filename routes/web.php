<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/client/ifs','ClientController@ifs');
// Route::get('/welcome',function() {
//     $data = [
//         'email' => 'joshuasaubon@gmail.com',
//         'raw_password' => 'test',
//         'link' => url('')
//     ];
//     return view('emails.welcome-email', ($data));
// });
Route::get('{all?}/{all1?}/{all2?}/{all3?}/{all4?}/{all5?}/{all6?}/{all7?}/{all8?}', 'HomeController@index')->name('home');
