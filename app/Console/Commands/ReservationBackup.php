<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ReservationBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservation:backup';

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
            $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
            $fields = urlencode($fields);
            // $now = date('Y-m-d H:i:s');
            // $add_1_hours = date('Y-m-d H:i:s', strtotime($now. ' +1 hours'));
            // $filters = '[{"field":"checkIn", "operator":"$gte", "context":"now", "value":"'.$now.'"}, {"field":"status", "operator":"$eq", "value":"confirmed"}]';
            // $filters = urlencode($filters);
            $guests = [];
            //The URL of the resource that is protected by Basic HTTP Authentication.
            $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&limit=$limit&skip=$skip&sort=$sort";
    
    
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
    
        function getInboxV2($guestId) {
            $fields = 'createdAt';
            $fields = urlencode($fields);
            $filters = '[{"field":"guest._id", "operator":"$eq", "value": "'.$guestId.'"}]';
            $filters = urlencode($filters);
            $guests = [];
            //The URL of the resource that is protected by Basic HTTP Authentication.
            $url = "https://open-api.guesty.com/v1/communication/conversations?filters=$filters";
    
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
    
        function getReservationsLogs($fullName) {
            $skip = 0;
            $sort = 'checkIn';
            $limit = 1;
            $q = '';
            $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
            $fields = urlencode($fields);
            $filters = '[{"field":"fullName", "operator":"$eq", "value":"'.$fullName.'"}]';
            $filters = urlencode($filters);
            $guests = [];
            //The URL of the resource that is protected by Basic HTTP Authentication.
            $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&limit=$limit&skip=$skip&sort=$sort";
    
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
    
        function getGuestConfirmedColor($fullName) {
    
    
            $logs = getReservationsLogs($fullName);
            $logs = json_decode(getReservationsLogs($fullName), true);
            $logs = array_column($logs['results'],'log')[0];
    
            // dd($logs);
            // $logs
    
            $booking_confirmed_logs = $logs[array_search('Booking was confirmed',array_column($logs,'event'))];
            $booked_at = str_replace('T', ' ',$booking_confirmed_logs['at']);
            $booked_at = str_replace('.000Z','', $booked_at);
            // dd($booking_confirmed_logs['at'],date('Y-m-d H:i:s', strtotime($booked_at)));
    
    
            $add_24_hours = date('Y-m-d H:i:s', strtotime($booked_at  . ' +24 hours'));
    
            $now = date('Y-m-d H:i:s');
            if(array_search('Booking was confirmed',array_column($logs,'event')) !== false) {
                if(strtotime($now) > strtotime($booked_at)) {
                    // dd('confirmed', $now, $add_24_hours);
    
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    
        function getSaltoksAccessGroup($site_id, $accessToken, $request) {
            $name_room_date = $request['listing']['nickname'];
            $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
            // $lock_name = explode(' ',$lock_name);
            // $lock_name = $lock_name[0];
    
            $customer_reference = substr($request['guest']['fullName'],0, 30) .' '. $lock_name .' '. date('md', strtotime($request['checkIn'])).'-'. date('md', strtotime($request['checkOut']));
            $customer_reference = urlencode($customer_reference);
    
            $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
            $url = $url."/v1.1/sites/$site_id/access_groups?%24filter=customer_reference%20eq%20%27$customer_reference%27&%24inlinecount=allpages";
    
    
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
    
        // GET FUTURE RESERVATIONS 
        $reservations = getReservations();
    
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');
    
        // GET ACCESS TOKEN
        $accessToken = getAccessToken();
    
        $reservations = json_decode($reservations, true);
        
        foreach ($reservations['results'] as $key => $reservation) {
            $status = $reservation['status'];
            $custom_fields = $reservation['customFields'];
            // CUSTOM FIELD ID 604bda2c937b110030025194 for Autohost STATUS
            $fieldKey = array_search('604bda2c937b110030025194',array_column($custom_fields,'fieldId'));
    
            // GET AUTOHOST STATUS
            $autohost_verified = 'unknown';
            if($fieldKey !== false) {
                $autohost_verified = $custom_fields[array_search('604bda2c937b110030025194',array_column($custom_fields,'fieldId'))]['value'];
            }
    
    
            $source = $reservation['source'];
            $paid = $reservation['money']['isFullyPaid'];
            $fullName = isset($reservation['guest']['fullName']) ? $reservation['guest']['fullName'] : null;
            $email = isset($reservation['guest']['email']) ? $reservation['guest']['email'] : null;
            $emails = isset($reservation['guest']['emails']) ? $reservation['guest']['emails'] : [];
            $phone = isset($reservation['guest']['phone']) ? $reservation['guest']['phone'] : null;
            if($email == null && count($emails) > 0) {
                $email = $emails[count($emails) -1];
            }
            
    
            if($fullName) {
                $emails_to_pull = [
                    '@guest.booking.com',
                    '@guest.vrbo.com',
                    '@guest.airbnb.com',
                    '@messages.homeaway.com'
                ];
                $pull_email = false;
                // CHECK IF REAL EMAIL
                if (!array_in_string($email, $emails_to_pull)) {
                    // CHECK IF CONFIRMED
                    if($status == 'confirmed') {
                        // CHECK IF AUTOHOST VERIFIED
                        if($autohost_verified == 'verified') {
                            // CHECK IF SOURCE is airbnb2
                            if($source == 'airbnb2') {
                                // CHECK IF EXISTING SALTOKS USER 
                                $searchUser = searchUser($site_id, $accessToken, $email);
                                if($searchUser['count'] > 0) {
                                    // IF EXISTING SALTOKS USER
                                    // ADD FIELDS FOR FRONTEND TABLE RENDER
                                    $reservations['results'][$key]['saltoks_user_existed'] = true;
                                    $reservations['results'][$key]['saltoks_user_blocked'] = $searchUser['items'][0]['blocked'];
                                    $reservations['results'][$key]['saltoks_user_id'] = $searchUser['items'][0]['id'];
                                    // CHECK IF SALTOKS ACCESS GROUP EXIST and STORE INFO to the FIELD
                                    $reservations['results'][$key]['accessGroupExist'] = getSaltoksAccessGroup($site_id, $accessToken, $reservation)['count'] > 0 ? true : false;
                                } else {
                                    $reservations['results'][$key]['saltoks_user_existed'] = false;
                                };
                            } else {
                                // IF NOT airbnb2, CHECK IF PAID
                                if($paid) {
                                    // CHECK IF EXISTING SALTOKS USER 
                                    $searchUser = searchUser($site_id, $accessToken, $email);
                                    if($searchUser['count'] > 0) {
                                        // IF EXISTING SALTOKS USER
                                        // ADD FIELDS FOR FRONTEND TABLE RENDER
                                        $reservations['results'][$key]['saltoks_user_existed'] = true;
                                        $reservations['results'][$key]['saltoks_user_blocked'] = $searchUser['items'][0]['blocked'];
                                        $reservations['results'][$key]['saltoks_user_id'] = $searchUser['items'][0]['id'];
                                        // CHECK IF SALTOKS ACCESS GROUP EXIST and STORE INFO to the FIELD
                                        $reservations['results'][$key]['accessGroupExist'] = getSaltoksAccessGroup($site_id, $accessToken, $reservation)['count'] > 0 ? true : false;
                                    } else {
                                        $reservations['results'][$key]['saltoks_user_existed'] = false;
                                    };
                                }
                            }
                        } else {
                            // IF NOT VERIFIED, CHECK IF NOT airbnb
                            if($source != 'airbnb2') {
                                // CHECK IF NOT PAID
                                if($paid == false) {
                                    // SET COLOR FOR THE GUEST FOR FRONTEND RENDER
                                    $reservations['results'][$key]['guestConfirmedColor'] = getGuestConfirmedColor($fullName);
                                }
                            }
                        }
                    }
                }
            }
        }
    

        \App\Backup::create(['response' => json_encode($reservations)]);
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
                'createdAt' => $reservation['createdAt'],
                'customFields' => json_encode($reservation['customFields']),
                'guest' => json_encode($reservation['guest']),
                'listing' => json_encode($reservation['listing']),
                'saltoks_user_existed' => isset($reservation['saltoks_user_existed']) ? $reservation['saltoks_user_existed'] : null,
                'saltoks_user_blocked' => isset($reservation['saltoks_user_blocked']) ? $reservation['saltoks_user_blocked'] : null,
                'saltoks_user_id' => isset($reservation['saltoks_user_id']) ? $reservation['saltoks_user_id'] : null,
                'accessGroupExist' => isset($reservation['accessGroupExist']) ? $reservation['accessGroupExist'] : null,
            ];
            // dd($data);
            \App\Reservation::updateOrCreate([
                'guesty_id' => $reservation['_id']
            ],$data);
        }
    
    }

    
}
