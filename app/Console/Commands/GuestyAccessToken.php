<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GuestyAccessToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'guesty:access_token';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'GET GUESTY ACCESS TOKEN';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $response = $this->getGuestyAccessToken();
    
        $accessToken = \App\GuestyAccessToken::create([
            'accessToken' => $response
        ]);
        return 0;
    }

    private function getGuestyAccessToken() {
        $url = 'https://open-api.guesty.com/oauth2/token';

        $client_id = env('GUESTY_CLIENT_ID');
        $client_secret = env('GUESTY_CLIENT_SECRET');

        $grant_type = urlencode('client_credentials');
        $scope = urlencode('open-api');

        // echo $url;

        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        curl_setopt($ch, CURLOPT_USERPWD, $client_id . ":" . $client_secret);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/x-www-form-urlencoded',
        ));


        $payload = array(
            "grant_type" => $grant_type,
            "scope" => $scope,
        );

        $payload = "grant_type=$grant_type&scope=$scope";
        // echo $payload;
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        //Tell cURL to return the output as a string instead
        //of dumping it to the browser.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        //Execute the cURL request.
        $response = curl_exec($ch);

        //Check for errors.
        if(curl_errno($ch)){
            //If an error occured, throw an Exception.
            // throw new Exception();
            // echo curl_error($ch);
            echo 'error';
        }

        return $response;
    }
}
