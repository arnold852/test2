<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Auth;


class ForgotPasswordController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //


        $email = $request->email;
        $user = \App\User::where('email',$email)->get()->first();
        if($user) {
            $token = $user->createToken('TMCMEMBERS')->accessToken;

            $to_email = $request->email;
            $link = url('forgotpassword-verify/'.$token);


            if($user->contact_id) {
                // UPDATE FORGOT PASSWORD LINK CUSTOM FIELD ON KEAP CONTACT
                $res = $this->updateInfusionSoftField('Contact',$user->contact_id,
                ["_ForgotPasswordLink" => $link]);

                if($res) {
                    $mail_data = [
                        "from_email" => "FAA@financialadvisorally.com",
                        'subject' => 'FAA Reset Password',
                        'html' => 'Reset Password!
                        <br/>
                        <br/>
                        Click <a href="'.$link.'" target="_blank">this</a> link to reset your password',
                        "to" => [
                            [
                                "email" => $email,
                                "type" => "to"
                            ],
                        ],
                        'template_id' => 10868 // FAA RESET PASSWORD
                    ];
        
                    // SEND REQUEST TO KEAP TO SEND FORGOT PASSWORD TEMPLATE
                    event(new \App\Events\IFSSendEmailEvent($mail_data));
                }
            }
            
            
    
            return response()->json([
                'success' => true,
               
            ]);

        } else {
            return response()->json([
                'success' => false,
                'data' => 'Email Address not found'
            ]);
        }


    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function auth(Request $request){

        return response()->json(['success'=> true],200);
    }

    public function passwordverify(Request $request)
    {
        
        
                $id = auth()->user()->id;
                $user =\App\User::find($id);
                $user->password =bcrypt($request->password) ;
                $user->save();
               
       
            return response()->json(['success'=> true,'data' => $user ], 200);
    }
}
