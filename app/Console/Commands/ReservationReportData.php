<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ReservationReportData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:reportdata';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $reservations = $this->getReservations();

        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');

        $accessToken = $this->getAccessToken();

        $reservations = json_decode($reservations, true);

        // dd($reservations);

        foreach ($reservations['results'] as $key => $reservation) {
            $data = [
                'guesty_id' => $reservation['_id'],
                'integration' => json_encode($reservation['integration']),
                'listingId' => $reservation['listingId'],
                'source' => $reservation['source'],
                'accountId' => $reservation['accountId'],
                'status' => $reservation['status'],
                'guestId' => $reservation['guestId'],
                'money' => json_encode($reservation['money']),
                'checkIn' => $reservation['checkIn'],
                'checkOut' => $reservation['checkOut'],
                'nightsCount' => $reservation['nightsCount'],
                'confirmedAt' => $reservation['confirmedAt'],
                'createdAt' => $reservation['createdAt'],
                'customFields' => json_encode($reservation['customFields']),
                'guest' => json_encode($reservation['guest']),
                'listing' => json_encode($reservation['listing']),
            ];
            // dd($data);
            \App\Reservation::updateOrCreate([
                'guesty_id' => $reservation['_id']
            ],$data);
        }

    }

    function array_in_string($str, array $arr) {
        foreach($arr as $arr_value) { //start looping the array
            if (stripos($str,$arr_value) !== false) return true; //if $arr_value is found in $str return true
        }
        return false; //else return false
    }
    function getReservations() {
        $skip = 0;
        $sort = 'checkIn';
        $limit = 100;
        // $q = $request->q;
        $fields = 'guest.phone nightsCount guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut confirmedAt customFields money source log createdAt listing';
        $fields = urlencode($fields);
        
        $date_from = date('Y-m-01',strtotime(date('Y-m-d'). '-1 month'));
        $date_to = date('Y-m-t',strtotime(date('Y-m-d'). '-1 month'));
        
        $date_start = $date_from.'T00:00:00';
        $date_end = $date_to.'T23:59:00';
        $filters = '[{"field":"checkIn", "operator":"$gte", "context":"now", "value":"'.$date_start.'"},{"field":"checkIn", "operator":"$lte", "context":"now", "value":"'.$date_end.'"}, {"field":"status", "operator":"$eq", "value":"confirmed"}]';
        // dd($filters);
        $filters = urlencode($filters);
        $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://api.guesty.com/api/v2/reservations?fields=$fields&limit=$limit&skip=$skip&sort=$sort&filters=$filters";

        //Your username.
        //Your password.
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);

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

    function getAccessToken() {
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_TOKEN_URL') : env('SANDBOX_SALTOKS_TOKEN_URL');

        //Your username.
        //Your password.
        $username = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_USERNAME') : env('SANDBOX_SALTOKS_USERNAME');;
        $password = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_PASSWORD') : env('SANDBOX_SALTOKS_PASSWORD');

        $user_username = urlencode(env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_USER_USERNAME') : env('SANDBOX_SALTOKS_USER_USERNAME'));
        $user_password = urlencode(env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_USER_PASSWORD') : env('SANDBOX_SALTOKS_USER_PASSWORD'));
        $grant_type = urlencode('password');
        $scope = urlencode('user_api.full_access');



        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/x-www-form-urlencoded',
        ));


        $payload = array(
            "grant_type" => $grant_type,
            "scope" => $scope,
            "username" => $user_username,
            "password" => $user_password,
        );

        $payload = "grant_type=$grant_type&scope=$scope&username=$user_username&password=$user_password";
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

        return json_decode($response, true);
    }
}
