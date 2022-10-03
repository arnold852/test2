<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class autohostLookUpCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autohost:lookup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "UPDATE GUESTY EMAIL FROM AUTOHOST";

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
        \Log::info("autohost lookup initiate");
        // GET FUTURE RESERVATIONS
        $reservations = $this->getReservations();   

        foreach ($reservations['results'] as $key => $reservation) {
            $status = $reservation['status'];
            $custom_fields = $reservation['customFields'];
            // CUSTOM FIELD ID 604bda2c937b110030025194 for Autohost STATUS
            $autohost_verified = $custom_fields[array_search('604bda2c937b110030025194',array_column($custom_fields,'fieldId'))]['value'];
            $source = $reservation['source'];
            $paid = $reservation['money']['isFullyPaid'];
            $email = isset($reservation['guest']['email']) ? $reservation['guest']['email'] : null;
            $emails = isset($reservation['guest']['emails']) ? $reservation['guest']['emails'] : [];
            $phone = isset($reservation['guest']['phone']) ? $reservation['guest']['phone'] : null;
            $guestId = $reservation['guestId'];
            $name = $reservation['guest']['fullName'];

            if($phone) {
                // EMAILS THAT NEEDS TO BE REPLACED WITH REAL EMAILS FROM AUTOHOST
                $emails_to_pull = [
                    '@guest.booking.com',
                    '@guest.vrbo.com',
                    '@guest.airbnb.com',
                    '@messages.homeaway.com'
                ];
                // COUNTER TO PULL EMAIL 
                $pull_email = false;

                // SEARCH EMAIL IN EMAILS TO REPLACE
                if ($this->array_in_string($email, $emails_to_pull)) {
                    if($status == 'confirmed') {
                        // CHECK IF VERIFIED
                        if($autohost_verified == 'verified') {
                            if($source == 'airbnb2') {
                                $pull_email = true;
                            } else {
                                if($paid) {
                                    $pull_email = true;
                                }
                            }
                        }
                    }
                }

                // IF Reservation Email needs to be replaced 
                // + status = confirmed 
                // + autohost status = verified
                // + source = airbnb2
                // IF NOT airbnb2, check if PAID, if PAID 
                // then pull EMAIL FROM AUTOHOST
                if($pull_email) {
                    $email = $this->autohost_lookup($phone);
                    if($email) {
                        \Log::info($phone);
                        \Log::info($guestId);
                        \Log::info($email);
                        \Log::info($emails);
                        \Log::info($name);
                        $update = $this->guesty_update($guestId, $email ,$emails, $name);
                        \Log::info($update);

                        // return $update;
                    }
                    
                }
                

                
            }
            
        }
    }

    function getReservations() {
        $skip = 0;
        $sort = 'checkIn';
        $limit = 100;
        $fields = 'guest.phone guest.fullName guest.email guest.emails status accountId checkIn checkOut customFields money source';
        $fields = urlencode($fields);
        $guests = [];
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/reservations?fields=$fields&limit=$limit&skip=$skip";

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
        $reservations = json_decode($response, true);
        // dd($reservations);
        
        //Check for errors.
        if(curl_errno($ch)){
            //If an error occured, throw an Exception.
            // throw new Exception();
            // echo curl_error($ch);
            echo 'error';
        }

        return $reservations;
    }

    function array_in_string($str, array $arr) {
        foreach($arr as $arr_value) { //start looping the array
            if (stripos($str,$arr_value) !== false) return true; //if $arr_value is found in $str return true
        }
        return false; //else return false
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
            $email = $autohost_data['items'][count($autohost_data['items']) -1]['guestportal']['email'];

            return $email;
        } 

        return false;
        
    }

    function guesty_update($guestId, $email, $emails, $name) {
        $emails = $emails;
        $email = $email;
        unset($emails[array_search($email, $emails)]);
        $emails[] = $email;
        $emails = array_values($emails);
        //The URL of the resource that is protected by Basic HTTP Authentication.
        $url = "https://open-api.guesty.com/v1/guests-crud/".$guestId;

        //Your username.
        //Your password.
        $accessToken = \App\GuestyAccessToken::orderBy('id','desc')->limit(1)->get()->first();        
        $accessToken = json_decode($accessToken['accessToken'], true);

        //Initiate cURL.
        $ch = curl_init($url);

        //Specify the username and password using the CURLOPT_USERPWD option.
        // curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
        $header = array(
            'Accept: application/json',
            'Authorization: Bearer '.$accessToken['access_token'],
            'Content-Type: application/json'
        );
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

        \Log::info($header);
        \Log::info($url);
        \Log::info($accessToken['access_token']);

        $payload = str_replace('\"','"',json_encode( array( "emails" => $emails, "email" => $email ) ));
        
        // curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        //Tell cURL to return the output as a string instead
        //of dumping it to the browser.

        //Execute the cURL request.
        $response = curl_exec($ch);

        $logs = \App\ActivityLog::create([
            'title' => $name,
            'log' => 'Guesty Actual Email Update: '. $email
        ]);

        

        return json_decode($response, true);
    }
}
