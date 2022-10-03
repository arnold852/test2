<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Square\SquareClient;
use Square\LocationsApi;
use Square\Exceptions\ApiException;
use Square\Http\ApiResponse;
use Square\Models\ListLocationsResponse;
use Square\Environment;
use Square\Models;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/




Route::post('login', 'PassportController@login');
Route::post('register', 'PassportController@register');

Route::apiResource('forgotpassword','ForgotPasswordController');

Route::middleware('auth:api')->group(function () {
    Route::apiResource('users','UserController');
    
});
Route::post('qbo/report/guesty_revenues', 'QboController@qboReportGuestyRevenues');