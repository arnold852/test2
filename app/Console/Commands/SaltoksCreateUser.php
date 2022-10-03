<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SaltoksCreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'saltoks:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Saltoks User';

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

        

        // return response()->json([
        //     'success' => true,
        //     'data' => $accessToken
        // ]);

        $reservations = json_decode($reservations, true);
        // return response()->json([
        //         'success' => true,
        //         'data' => $reservations
        // ]);


        // dd($reservations);
        foreach ($reservations['results'] as $key => $reservation) {
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
            $fullName = isset($reservation['guest']['phone']) ? $reservation['guest']['fullName'] : null;
            if($email == null && count($emails) > 0) {
                $email = $emails[count($emails) -1];
            }
            

            
            $guestId = $reservation['guestId'];

            if($phone) {
                // $autohost_id = autohost_lookup($phone);
                // $reservations['results'][$key]['autohost_link'] = 'https://portal.autohost.ai/reservation/'.$autohost_id;
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
                                // CHECK IF EXISTING SALTOKS USER  VIA EMAIL
                                $searchUser = $this->searchUser($site_id, $accessToken, $email);
                                
                                if($searchUser['count'] > 0) {
                                    // dd($searchUser);
                                    // IF EXISTING SALTOKS USER
                                    $reservations['results'][$key]['saltoks_user_existed'] = true;
                                    $reservations['results'][$key]['saltoks_user_blocked'] = $searchUser['items'][0]['blocked'];
                                    $reservations['results'][$key]['saltoks_user_id'] = $searchUser['items'][0]['id'];
                                    // CHECK IF EXISTING ACCESS GRUP
                                    $getSaltoksAccessGroup = $this->getSaltoksAccessGroup($accessToken, $reservation);
                                    
                                    if($getSaltoksAccessGroup['count'] == 0) {
                                        // IF NOT EXISTING ACCESS GROUP
                                        // CREATE ACCESS GROUP
                                        $this->saltoks_create_user($reservation,$searchUser['items'][0]['user']['id']);
                                    }
                                    
                                } else {
                                    // IF NOT EXISTING USER
                                    $reservations['results'][$key]['saltoks_user_existed'] = false;
                                    // CREATE USER AND ACCESS GROUP

                                    
                                    $this->saltoks_create_user($reservation);
                                    // if($fullName == 'Quintin Stamps') {
                                    //     dd($searchUser, 'create user');
                                    // }
                                };
                            } else {
                                // IF NOT airbnb2, CHECK IF PAID
                                if($paid) {
                                    // CHECK IF EXISTING SALTOKS USER 
                                    $searchUser = $this->searchUser($site_id, $accessToken, $email);
                                    if($searchUser['count'] > 0) {
                                         // IF EXISTING SALTOKS USER
                                        $reservations['results'][$key]['saltoks_user_existed'] = true;
                                        $reservations['results'][$key]['saltoks_user_blocked'] = $searchUser['items'][0]['blocked'];
                                        $reservations['results'][$key]['saltoks_user_id'] = $searchUser['items'][0]['id'];
                                        // CHECK IF EXISTING ACCESS GRUP
                                        $getSaltoksAccessGroup = $this->getSaltoksAccessGroup($accessToken, $reservation);
                                        if($getSaltoksAccessGroup['count'] == 0) {
                                            // IF NOT EXISTING ACCESS GROUP
                                            // CREATE ACCESS GROUP
                                            $this->saltoks_create_user($reservation,$searchUser['items'][0]['user']['id']);
                                        }
                                    } else {
                                        // IF NOT EXISTING USER
                                        $reservations['results'][$key]['saltoks_user_existed'] = false;
                                        // CREATE USER AND ACCESS GROUP
                                        $this->saltoks_create_user($reservation);
                                    };
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

    function getReservations() {
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

    function autohost_lookup($phone) {
        $url = "https://data.autohost.ai/v1/reservations?search=$phone";


        //Initiate cURL.
        $ch = curl_init($url);
        
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'x-api-key: GjNflZHKa6xclFqUR6oSb5gMDda9vHEqLPfM0K5j1Tw77O3n',
        ));
    
        //Tell cURL to return the output as a string instead
        //of dumping it to the browser.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
        //Execute the cURL request.
        $response = curl_exec($ch);
        
        //Check for errors.
        if(curl_errno($ch)){
            //If an error occured, throw an Exception.
            throw new Exception(curl_error($ch));
        }
    
        //Print out the response.
        $autohost_data = json_decode($response, true);
        if(count($autohost_data['items']) > 0) {
            $id = $autohost_data['items'][count($autohost_data['items']) -1]['id'];

            return $id;
        } 

        return false;
        
    }

    function addSaltoksUser($site_id, $accessToken, $guest) {
    
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/users";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

        $role_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_ROLE_ID') : env('SANDBOX_SALTOKS_ROLE_ID');
        $fullName = $guest['fullName'];
        $fullName = explode(' ',$fullName);
        $lastname = array_pop($fullName);
        $firstname = implode(" ", $fullName);
        $email = isset($guest['email']) ? $guest['email'] : null;
        $emails = isset($guest['emails']) ? $guest['emails'] : null;

        if($email == null && count($emails) > 0) {
            $email = $emails[count($emails) -1];
        }
        // dd($email);
        
        $payload = str_replace('\"','"',json_encode( 
            array( 
                "first_name" => $firstname, 
                "last_name" => $lastname,
                "email" => $email,
                "role_ids" => [
                    $role_id
                ],
                "toggle_easy_office_mode" => false,
                "toggle_manual_office_mode" => false,
                "blocked" => false,
                "subscription_status" => 'subscribed',
                "override_privacy_mode" => true,
                "use_pin" => false,
            ) 
        ));
        
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

    function addSaltoksAccessGroup($site_id, $accessToken, $request) {

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/access_groups";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));
        $name_room_date = $request['listing']['nickname'];
        $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
        // $lock_name = explode(' ',$lock_name);
        // $lock_name = $lock_name[0];

        $payload = str_replace('\"','"',json_encode( 
            array( 
                "customer_reference" => substr($request['guest']['fullName'],0, 30) .' '. $lock_name .' '. date('md', strtotime($request['checkIn'])).'-'. date('md', strtotime($request['checkOut'])), 
                // "customer_reference" => $request->guest['fullName'] .' '. $request->listing['nickname'], 
            ) 
        ));
        
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

    function addSaltoksAccessGroupUser($site_id, $accessToken, $accessGroupId, $user_id, $request) {

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/access_groups/$accessGroupId/users";


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
                "user_id" => $user_id, 
            ) 
        ));
        
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

    function addSaltoksAccessGroupTimeSchedules($site_id, $accessToken, $accessGroupId ,$request) {

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/access_groups/$accessGroupId/time_schedules";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

        $checkIn = $request['checkIn'];
        $checkIn = explode('T',$checkIn);
        $checkIn = $checkIn[0]. ' 16:00:00';

        $checkOut = $request['checkOut'];
        $checkOut = explode('T',$checkOut);
        $checkOut = $checkOut[0]. ' 11:10:00';

        $payload = str_replace('\"','"',json_encode( 
            array( 
                "monday" => true,
                "tuesday" => true,
                "wednesday" => true,
                "thursday" => true,
                "friday" => true,
                "saturday" => true,
                "sunday" => true,
                "start_time" => '00:00:00',
                "end_time" => '23:59:00',
                "start_date" => $checkIn,
                "end_date" => $checkOut
            ) 
        ));
        
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

    function getSaltoksAccessGroupLock($site_id, $accessToken, $request, $lock_name) {

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/locks?%24filter=contains%28customer_reference%2C%27%23$lock_name%27%29&%24inlinecount=allpages";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
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

        return json_decode($response, true);
    }
    function addSaltoksAccessGroupLocks($site_id, $accessToken, $accessGroupId, $lock_id ,$request) {

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/access_groups/$accessGroupId/locks";


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
                "lock_id" => $lock_id
            ) 
        ));
        
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



    function getSaltoksAccessGroup($accessToken, $request) {
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');

        $name_room_date = $request['listing']['nickname'];
        $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
        // $lock_name = explode(' ',$lock_name);
        // $lock_name = $lock_name[0];

        $accessGroupName = substr($request['guest']['fullName'],0, 30) .' '. $lock_name .' '. date('md', strtotime($request['checkIn'])).'-'. date('md', strtotime($request['checkOut']));
        // echo $accessGroupName;
        $accessGroupName = urlencode($accessGroupName);

        
        $url = $url."/v1.1/sites/$site_id/access_groups?%24filter=customer_reference%20eq%20%27$accessGroupName%27&%24inlinecount=allpages";

        // return $url;
        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
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
            return curl_error($ch);
            // return 'error';
        }

        return json_decode($response, true);
    }


    function saltoks_create_user($request, $saltoks_id = null) {
    
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');
    
        $accessToken = $this->getAccessToken();
    
        $name_room_date = $request['listing']['nickname'];
        $fullName = $request['guest']['fullName'];
    
        $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
        // CHANGE THIS WHEN DYNAMIC
        $lock_name = explode(' ',$lock_name);
        $lock_name = $lock_name[1];
        // 
        if(strpos($lock_name, 'A')) {
            // ADD SIDE ENTRANCE LOCK
            $lock_name = str_replace('A', '', $lock_name);
        }
        if(strpos($lock_name, 'B')) {
            // ADD SIDE ENTRANCE LOCK
            $lock_name = str_replace('B', '', $lock_name);
        }

        
        
        $getSaltoksAccessGroupLock = $this->getSaltoksAccessGroupLock($site_id, $accessToken, $request, $lock_name);
        
        if($getSaltoksAccessGroupLock['count'] > 0) {
            $front_lock_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_FRONT_LOCK_ID') : null;;
            $lock_id = $getSaltoksAccessGroupLock['items'][0]['id'];
            
            if($saltoks_id == null) {
                $addSaltoksUser = $this->addSaltoksUser($site_id, $accessToken, $request['guest']);
                
                if(isset($addSaltoksUser['ErrorCode'])) {
                    // dd($addSaltoksUser, $request['guest']['email']);
                    \Log::info($site_id);
                    \Log::info($request['guest']['email']);
                    \Log::info($addSaltoksUser);
                    return false;
                }
                $saltoks_id = $addSaltoksUser['user']['id'];
            }
            
            
            $addSaltoksAccessGroup = $this->addSaltoksAccessGroup($site_id, $accessToken, $request);
            $addSaltoksAccessGroupUser = $this->addSaltoksAccessGroupUser($site_id, $accessToken, $addSaltoksAccessGroup['id'], $saltoks_id, $request);
            $addSaltoksAccessGroupTimeSchedules = $this->addSaltoksAccessGroupTimeSchedules($site_id, $accessToken, $addSaltoksAccessGroup['id'], $request);
    
    
            // FRONT LOCK
            if($front_lock_id) {
                $addSaltoksAccessGroupLocks = $this->addSaltoksAccessGroupLocks($site_id, $accessToken, $addSaltoksAccessGroup['id'], $front_lock_id, $request);    
            }
            
            // ROOM LOCK
            $addSaltoksAccessGroupLocks = $this->addSaltoksAccessGroupLocks($site_id, $accessToken, $addSaltoksAccessGroup['id'], $lock_id, $request);
    
            $logs = \App\ActivityLog::create([
                'title' => $fullName,
                'log' => 'Saltoks Create User '
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Lock not found'
            ]);
        }
    
        // return response()->json([
        //     'success' => true,
        //     'lock_name' => $lock_name,
        //     'getSaltoksAccessGroupLock' => $getSaltoksAccessGroupLock,
        //     'name_room_date' => $name_room_date,
        //     '$request->listing' => $request->listing
        // ]);
        // $lock_id = '5ad1b85b-4381-4004-abcf-f17e91e20e20';
        
    
        
    
       
    }

    


    function saltoks_existing_user($request, $saltoks_id) {
    
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');
    
        $accessToken = $this->getAccessToken();
    
        $name_room_date = $request['listing']['nickname'];
        $fullName = $request['guest']['fullName'];
    
        $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
        // CHANGE THIS WHEN DYNAMIC
        $lock_name = explode(' ',$lock_name);
        $lock_name = $lock_name[1];
        // 
        if(strpos($lock_name, 'A')) {
            // ADD SIDE ENTRANCE LOCK
            $lock_name = str_replace('A', '', $lock_name);
        }
        if(strpos($lock_name, 'B')) {
            // ADD SIDE ENTRANCE LOCK
            $lock_name = str_replace('B', '', $lock_name);
        }
    
        $getSaltoksAccessGroupLock = $this->getSaltoksAccessGroupLock($site_id, $accessToken, $request, $lock_name);
        if($getSaltoksAccessGroupLock['count'] > 0) {
            $front_lock_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_FRONT_LOCK_ID') : null;;
            $lock_id = $getSaltoksAccessGroupLock['items'][0]['id'];
    
            $addSaltoksUser = $this->addSaltoksUser($site_id, $accessToken, $request['guest']);
            if(isset($addSaltoksUser['ErrorCode'])) {
                \Log::info($site_id);
                \Log::info($request['guest']['email']);
                \Log::info($addSaltoksUser);
                return false;
            }
            $addSaltoksAccessGroup = $this->addSaltoksAccessGroup($site_id, $accessToken, $request);
            $addSaltoksAccessGroupUser = $this->addSaltoksAccessGroupUser($site_id, $accessToken, $addSaltoksAccessGroup['id'], $addSaltoksUser['user']['id'], $request);
            $addSaltoksAccessGroupTimeSchedules = $this->addSaltoksAccessGroupTimeSchedules($site_id, $accessToken, $addSaltoksAccessGroup['id'], $request);
    
    
            // FRONT LOCK
            if($front_lock_id) {
                $addSaltoksAccessGroupLocks = $this->addSaltoksAccessGroupLocks($site_id, $accessToken, $addSaltoksAccessGroup['id'], $front_lock_id, $request);    
            }
            
            // ROOM LOCK
            $addSaltoksAccessGroupLocks = $this->addSaltoksAccessGroupLocks($site_id, $accessToken, $addSaltoksAccessGroup['id'], $lock_id, $request);
    
    
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Lock not found'
            ]);
        }
    
        // return response()->json([
        //     'success' => true,
        //     'lock_name' => $lock_name,
        //     'getSaltoksAccessGroupLock' => $getSaltoksAccessGroupLock,
        //     'name_room_date' => $name_room_date,
        //     '$request->listing' => $request->listing
        // ]);
        // $lock_id = '5ad1b85b-4381-4004-abcf-f17e91e20e20';
        
    
        
    
        $logs = \App\ActivityLog::create([
            'title' => $fullName,
            'log' => 'Saltoks Create User '
        ]);
    }
}
