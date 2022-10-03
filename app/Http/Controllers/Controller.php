<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function getAccessToken() {
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

    public function array_in_string($str, array $arr) {
        foreach($arr as $arr_value) { //start looping the array
            if (stripos($str,$arr_value) !== false) return true; //if $arr_value is found in $str return true
        }
        return false; //else return false
    }

    public function getReservations($request) {
        $skip = $request->skip;
        $sort = $request->sort;
        $limit = $request->limit;
        $q = $request->q;
        $fields = 'plannedArrival plannedDeparture guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
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
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function getInboxV2($guestId) {
        $fields = 'createdAt';
        $fields = urlencode($fields);
        $filters = '[{"field":"guest._id", "operator":"$eq", "value": "'.$guestId.'"}]';
        $filters = urlencode($filters);
        $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/communication/conversations?filters=$filters";

        //Your username.
        //Your password.
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function searchSaltoksUser($site_id, $accessToken, $email) {

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

    public function autohost_lookup($phone) {
        $url = "https://data.autohost.ai/v1/reservations?search=$phone";


        //Initiate cURL.
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'x-api-key: '.env("AUTOHOST_API_KEY"),
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

    public function getReservationsLogs($fullName) {
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
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function getGuestConfirmedColor($fullName) {


        $logs = $this->getReservationsLogs($fullName);
        $logs = json_decode($logs, true);
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

    public function getSaltoksAccessGroup($accessToken, $request) {
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');
        $name_room_date = $request['listing']['nickname'];
        $lock_name = str_replace(' - Unit ', ' ', $name_room_date);
        // $lock_name = explode(' ',$lock_name);
        // $lock_name = $lock_name[0];

        $customer_reference = substr($request['guest']['fullName'],0, 30) .' '. $lock_name .' '. date('md', strtotime($request['checkIn'])).'-'. date('md', strtotime($request['checkOut']));
        // dd($customer_reference);
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

    public function addSaltoksUser($site_id, $accessToken, $guest) {

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
        $payload = str_replace('\"','"',json_encode(
            array(
                "first_name" => $firstname,
                "last_name" => $lastname,
                "email" => $guest['email'],
                "role_ids" => [
                    $role_id
                ],
                "toggle_easy_office_mode" => false,
                "toggle_manual_office_mode" => false,
                "blocked" => false,
                "subscription_state" => 'subscribed',
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

    public function addSaltoksAccessGroup($site_id, $accessToken, $request) {

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

    public function addSaltoksAccessGroupUser($site_id, $accessToken, $accessGroupId, $user_id, $request) {

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

    public function addSaltoksAccessGroupTimeSchedules($site_id, $accessToken, $accessGroupId ,$request) {

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

        $checkIn = $request->checkIn;
        $checkIn = explode('T',$checkIn);
        $checkIn = $checkIn[0]. ' 16:00:00';

        $checkOut = $request->checkOut;
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

    public function getSaltoksAccessGroupLock($site_id, $accessToken, $request, $lock_name) {

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

    public function addSaltoksAccessGroupLocks($site_id, $accessToken, $accessGroupId, $lock_id ,$request) {

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

    public function deleteSiteUser($accessToken, $request) {
        $site_id = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_SITE_ID') : env('SANDBOX_SALTOKS_SITE_ID');

        $url = env('SALTOKS_ENV') == 'prod' ? env('SALTOKS_URL') : env('SANDBOX_SALTOKS_URL');
        $url = $url."/v1.1/sites/$site_id/users/$request->saltoks_user_id";


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

    public function deleteAccessGroup($accessToken, $accessGroupId) {
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

    public function getActiveReservations($activeUsers) {
        $skip = 0;
        $sort = 'checkIn';
        $limit = 100;
        $q = '';
        $fields = 'daysInAdvance guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
        $fields = urlencode($fields);
        $guests = [];
        $now = date('Y-m-d H:i:s');
        $filters = urlencode('[{"field":"guest.fullName", "operator":"$in", "value":'.$activeUsers.'}, {"field":"checkOut", "operator":"$gte", "value":"'.$now.'"}, {"field":"checkIn", "operator":"$lte", "value":"'.$now.'"}]');
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&limit=$limit&skip=$skip&filters=$filters";
        // echo $url;

        //Your username.
        //Your password.
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function parseAuthRedirectUrl($url)
    {
        parse_str($url,$qsArray);
        return array(
            'code' => $qsArray['code'],
            'realmId' => $qsArray['realmId']
        );
    }

    public function getReservationListings($ids) {
        // $skip = 0;
        // $sort = 'checkIn';
        // $limit = 100;
        // $q = $request->q;
        // $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut confirmedAt customFields money source log createdAt listing';
        // $fields = urlencode($fields);
        
        // $date_start = $request->date_from.'T00:00:00';
        // $date_end = $request->date_to.'T23:59:00';
        // $filters = '[{"field":"checkIn", "operator":"$gte", "context":"now", "value":"'.$date_start.'"},{"field":"checkIn", "operator":"$lte", "context":"now", "value":"'.$date_end.'"}, {"field":"status", "operator":"$eq", "value":"confirmed"}]';
        // dd($filters);
        // $filters = urlencode($filters);
        // $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/listings?ids=$ids";

        //Your username.
        //Your password.
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function getReservation($guestId) {
        $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
        $fields = urlencode($fields);
        $filters = '[{"field":"guest._id", "operator":"$eq", "value":"'.$guestId.'"}]';
        $filters = urlencode($filters);
        $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&filters=$filters";


        //Your username.
        //Your password.
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function getListing($listingId) {
        // $fields = 'guest.phone guest.fullName conversations guest.email guest.emails status accountId checkIn checkOut customFields money source log createdAt listing';
        // $fields = urlencode($fields);
        // $filters = '[{"field":"guest._id", "operator":"$eq", "value":"'.$listingId.'"}]';
        // $filters = urlencode($filters);
        // $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/listings/$listingId";


        //Your username.
        //Your password.
        $username = env('GUESTY_USERNAME');
        $password = env('GUESTY_PASSWORD');

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

    public function addSaltoksAccessGroupTimeSchedulesCustom($site_id, $accessToken, $accessGroupId ,$request, $plannedArrival = '16:00', $plannedDeparture = '11:10') {

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
        $checkIn = $checkIn[0]. ' '.$plannedArrival.':00';

        $checkOut = $request['checkOut'];
        $checkOut = explode('T',$checkOut);
        $checkOut = $checkOut[0]. ' '.$plannedDeparture.':00';

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

    public function getSaltoksAccessGroupLockCustom($site_id, $accessToken, $request) {
        $name_room_date = $request['listing']['nickname'];
    
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

    public function deleteSiteUserCustom($accessToken, $saltoks_user_id) {
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
}

