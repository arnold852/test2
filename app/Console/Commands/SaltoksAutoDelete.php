<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SaltoksAutoDelete extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'saltoks:autodelete';

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
         // GET PAST RESERVATIONS TO DELETE (4WEEKS AFTER CHECKOUT) Basically get guests 4 weeks after checkout, and then they will be deleted
        $checkOut_guests_auto_delete = json_decode($this->getReservationsByCheckoutAutoDelete(), true);

        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');

        $accessToken = $this->getAccessToken();

        foreach ($checkOut_guests_auto_delete['results'] as $key => $reservation) {
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
            if($email == null && count($emails) > 0) {
                $email = $emails[count($emails) -1];
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

                //this example should return FOUND
                if (!$this->array_in_string($email, $emails_to_pull)) {
                    // echo "first: Match found<br>"; 
                    if($status == 'confirmed') {
                        if($autohost_verified == 'verified') {
                            // dd($email);
                            if($source == 'airbnb2') {
                                $searchUser = $this->searchUser($site_id, $accessToken, $email);
                                // dd($searchUser);
                                if($searchUser['count'] > 0) {
                                    $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = true;
                                    // $checkOut_guests_auto_block['results'][$key]['saltoks_user_blocked'] = $searchUser['items'][0]['blocked'];
                                    // $checkOut_guests_auto_block['results'][$key]['saltoks_user_id'] = $searchUser['items'][0]['id'];
                                    // DELETE USER
                                    $deleteSiteUser = $this->deleteSiteUser($accessToken, $searchUser['items'][0]['id']);
                                    $getSaltoksAccessGroup = $this->getSaltoksAccessGroup($accessToken, $reservation);

                                    if($getSaltoksAccessGroup['count'] > 0) {
                                        $accessGroupId = $getSaltoksAccessGroup['items'][0]['id'];
                                        $deleteAccessGroup = $this->deleteAccessGroup($accessToken, $accessGroupId);
                                    }
                                    $logs = \App\ActivityLog::create([
                                        'title' => $reservation['guest']['fullName'],
                                        'log' => 'Saltoks Delete User '
                                    ]);
                                } else {
                                    $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = false;
                                };
                            } else {
                                if($paid) {
                                    $searchUser = $this->searchUser($site_id, $accessToken, $email);
                                    // dd($searchUser);
                                    if($searchUser['count'] > 0) {
                                        $checkOut_guests_auto_block['results'][$key]['saltoks_user_existed'] = true;
                                        // $checkOut_guests_auto_block['results'][$key]['saltoks_user_blocked'] = $searchUser['items'][0]['blocked'];
                                        // $checkOut_guests_auto_block['results'][$key]['saltoks_user_id'] = $searchUser['items'][0]['id'];
                                        // DELETE USER
                                        $deleteSiteUser = $this->deleteSiteUser($accessToken, $searchUser['items'][0]['id']);
                                        $getSaltoksAccessGroup = $this->getSaltoksAccessGroup($accessToken, $reservation);

                                        if($getSaltoksAccessGroup['count'] > 0) {
                                            $accessGroupId = $getSaltoksAccessGroup['items'][0]['id'];
                                            $deleteAccessGroup = $this->deleteAccessGroup($accessToken, $accessGroupId);
                                        }
                                        $logs = \App\ActivityLog::create([
                                            'title' => $reservation['guest']['fullName'],
                                            'log' => 'Saltoks Delete User '
                                        ]);
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

    function getReservationsByCheckoutAutoDelete() {
        $skip = 0;
        $sort = '-checkOut';
        $limit = 10;
        $q = '';
        $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
        $fields = urlencode($fields);
        $now = date('Y-m-d H:i:s');
        $add_4_weeks = date('Y-m-d H:i:s', strtotime($now. ' -4 weeks'));
        $filters = '[{"field":"checkOut", "operator":"$lte", "context":"now", "value":"'.$add_4_weeks.'"}, {"field":"status", "operator":"$eq", "value":"confirmed"}]';
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

    function deleteSiteUser($accessToken, $saltoks_user_id) {
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');

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

        // $payload = str_replace('\"','"',json_encode( 
        //     array( 
        //         "blocked" => $blocked,
        //     ) 
        // ));
        
        // curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE'); 
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

    function getSaltoksAccessGroup($accessToken, $request) {
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');
        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');

        $name_room_date = $request['listing']['nickname'];
        $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
        // $lock_name = explode(' ',$lock_name);
        // $lock_name = $lock_name[0];

        $accessGroupName = substr($request['guest']['fullName'],0, 30) .' '. $lock_name .' '. date('md', strtotime($request['checkIn'])).'-'. date('md', strtotime($request['checkOut']));
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


    function deleteAccessGroup($accessToken, $accessGroupId) {
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/access_groups/$accessGroupId";


        //Initiate cURL.
        $ch = curl_init($url);
        
        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);  

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
        ));

        // $payload = str_replace('\"','"',json_encode( 
        //     array( 
        //         "blocked" => $blocked,
        //     ) 
        // ));
        
        // curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE'); 
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

    
}
