<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SaltoksAutoBlock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'saltoks:autoblock';

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
        // GET FUTURE DAYS RESERVATIONS TO ADD (BETWEEN NOW AND NOW+48HOURS)
        $reservation_to_adds = json_decode($this->getReservationsAutoAdd(), true);
        $reservation_to_adds = array_column(array_column($reservation_to_adds['results'], 'guest'),'fullName');

        // GET PAST RESERVATIONS TO BLOCK (BETWEEN NOW AND NOW-2HOURS AND NOW-1HOUR) Basically get guests some time (1 hour) to checkout, and then they will be blocked
        $checkOut_guests_auto_block = json_decode($this->getReservationsByCheckoutAutoBlock(), true);
        // dd($checkOut_guests_auto_block);

        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');

        $accessToken = $this->getAccessToken();

        foreach ($checkOut_guests_auto_block['results'] as $key => $reservation) {
            // dd($reservation);
            $status = $reservation['status'];
            $custom_fields = $reservation['customFields'];
            $fieldKey = array_search('604bda2c937b110030025194',array_column($custom_fields,'fieldId'));

            $autohost_verified = 'unknown';
            if($fieldKey !== false) {
                $autohost_verified = $custom_fields[array_search('604bda2c937b110030025194',array_column($custom_fields,'fieldId'))]['value'];
            }
            
            
            $source = $reservation['source'];
            $paid = $reservation['money']['isFullyPaid'];
            $email = isset($reservation['guest']['email']) ? $reservation['guest']['email'] : null;
            $emails = isset($reservation['guest']['emails']) ? $reservation['guest']['emails'] : [];
            $phone = isset($reservation['guest']['phone']) ? $reservation['guest']['phone'] : null;
            $fullName = isset($reservation['guest']['fullName']) ? $reservation['guest']['fullName'] : null;

            // CHECK IF THERES NO UPCOMING 48 HOURS RESERVATION FOR THE SAME NAME
            if(array_search($fullName, $reservation_to_adds) === false) {
                // if($fullName == 'Hugo Suarez') {
                //     return false;
                // } 

                if(count($emails) > 0) {
                    // $email = $emails[count($emails) -1];
                }
                
                // $guestId = $reservation['guestId'];

                if($phone) {
                    // $autohost_id = autohost_lookup($phone);
                    // $checkOut_guests_auto_block['results'][$key]['autohost_link'] = 'https://portal.autohost.ai/reservation/'.$autohost_id;
                    $emails_to_pull = [
                        '@guest.booking.com',
                        '@guest.vrbo.com',
                        '@guest.airbnb.com',
                        '@messages.homeaway.com'
                    ];
                    $pull_email = false;

                    // CHECK IF REAL EMAIL
                    if (!$this->array_in_string($email, $emails_to_pull)) {
                        // CHECK IF CONFIRMED
                        if($status == 'confirmed') {
                            // CHECK IF AUTOHOST VERIFIED
                            if($autohost_verified == 'verified') {
                                // CHECK IF SOURCE is airbnb2
                                if($source == 'airbnb2') {
                                    // CHECK IF EXISTING SALTOKS USER 
                                    $searchUser = $this->searchUser($site_id, $accessToken, $email);
                                    if($searchUser['count'] > 0) {
                                        // IF EXISTING SALTOKS USER
                                        // CHECK IF ITS ALREADY BLOCKED
                                        $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = true;
                                        if($searchUser['items'][0]['blocked'] == false) {
                                            // BLOCK USER
                                            $this->blockUser($site_id, $accessToken, $searchUser['items'][0]['id'], $reservation['guest']['fullName']);
                                            $this->suspendUser($site_id, $accessToken, $searchUser['items'][0]['id'], $reservation['guest']['fullName']);
                                        }
                                    } else {
                                        $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = false;
                                    };
                                } else {
                                    // IF NOT airbnb2, CHECK IF PAID
                                    if($paid) {
                                        // CHECK IF EXISTING SALTOKS USER 
                                        $searchUser = $this->searchUser($site_id, $accessToken, $email);
                                        if($searchUser['count'] > 0) {
                                            // IF EXISTING SALTOKS USER
                                            // CHECK IF ITS ALREADY BLOCKED
                                            $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = true;
                                            if($searchUser['items'][0]['blocked'] == false) {
                                                // BLOCK USER
                                                $this->blockUser($site_id, $accessToken, $searchUser['items'][0]['id'], $reservation['guest']['fullName']);
                                                $this->suspendUser($site_id, $accessToken, $searchUser['items'][0]['id'], $reservation['guest']['fullName']);
                                            }
                                        } else {
                                            $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = false;
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
        }
    }

    function array_in_string($str, array $arr) {
        foreach($arr as $arr_value) { //start looping the array
            if (stripos($str,$arr_value) !== false) return true; //if $arr_value is found in $str return true
        }
        return false; //else return false
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

    function getReservationsByCheckoutAutoBlock() {
        $skip = 0;
        $sort = '-checkOut';
        $limit = 10;
        $q = '';
        $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
        $fields = urlencode($fields);
        $now = date('Y-m-d H:i:s');
        $minus_1_hours = date('Y-m-d H:i:s', strtotime($now. ' -1 hours'));
        $minus_2_hours = date('Y-m-d H:i:s', strtotime($now. ' -2 hours'));
        $filters = '[{"field":"checkOut", "operator":"$lte", "context":"now", "value":"'.$minus_1_hours.'"}, {"field":"checkOut", "operator":"$gte", "context":"now", "value":"'.$minus_2_hours.'"}, {"field":"status", "operator":"$eq", "value":"confirmed"}]';
        $filters = urlencode($filters);
        $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&limit=$limit&skip=$skip&filters=$filters&sort=$sort";

        //Your username.
        //Your password.
        $accessToken = \App\GuestyAccessToken::orderBy('id','desc')->limit(1)->get()->first();        
        $accessToken = json_decode($accessToken['accessToken'], true);

        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

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

    function searchUser($site_id, $accessToken, $email) {

        $filter = urlencode("user/email eq '$email'");
        $inlinecount = 'allpages';
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/users?%24filter=$filter&%24inlinecount=$inlinecount";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

        
        // echo $payload;
        // curl_setopt($ch, CURLOPT_POST, 1);
        // curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

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

    function blockUser($site_id, $accessToken, $saltoks_user_id, $name) {
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/users/$saltoks_user_id";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

        $payload = str_replace('\"','"',json_encode( 
            array( 
                "blocked" => true,
            ) 
        ));
        
        // curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH'); 
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

        // dd($response);

        
        $logs = \App\ActivityLog::create([
            'title' => $name,
            'log' => 'Access Status: Blocked'
        ]);
    }
    function suspendUser($site_id, $accessToken, $saltoks_user_id, $name) {
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/users/$saltoks_user_id/subscription";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

        $payload = str_replace('\"','"',json_encode( 
            array( 
                "state" => "suspended"
            ) 
        ));
        
        // curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH'); 
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

        // dd($response);


        $logs = \App\ActivityLog::create([
            'title' => $name,
            'log' => 'Subscribed: No'
        ]);
    }

    function getReservationsAutoAdd() {
        $skip = 0;
        $sort = 'checkIn';
        $limit = 100;
        $q = '';
        $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
        $fields = urlencode($fields);
        $now = date('Y-m-d');
        $add_48_hours = date('Y-m-d', strtotime($now. ' +48 hours'));
        $filters = '[{"field":"checkIn", "operator":"$lt", "context":"now", "value":"'.$add_48_hours.'"}, {"field":"checkIn", "operator":"$gt", "context":"now", "value":"'.$now.'"}, {"field":"status", "operator":"$eq", "value":"confirmed"}]';
        $filters = urlencode($filters);
        $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&limit=$limit&skip=$skip&filters=$filters";

        //Your username.
        //Your password.
        $accessToken = \App\GuestyAccessToken::orderBy('id','desc')->limit(1)->get()->first();        
        $accessToken = json_decode($accessToken['accessToken'], true);

        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

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
