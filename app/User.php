<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'active', 'role', 'phone', 'contact_id', 'password_plain', 'upload'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token','password_plain'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function assessment_answerss() {
        return $this->hasMany('App\AssessmentAnswer','user_id');
    }
    public function client() {
        return $this->hasOne('App\Client','user_id');
    }

    public function member_purchases() {
        return $this->hasMany('App\MemberPurchase','user_id');
    }

    public function member_client() {
        return $this->belongsTo('App\Client','client_id');
    }

    public function client_groups() {
        return $this->hasMany('App\ClientGroup','user_id');
    }

    public function user_client_groups() {
        return $this->hasMany('App\UserClientGroup','user_id');
    }

    public function advisor_firm() {
        return $this->hasOne('App\AdvisorFirm','user_id');
    }

    public function firm() {
        return $this->hasOne('App\Firm','user_id');
    }




    public static function boot() {
        parent::boot();
        self::deleting(function($user) { // before delete() method call this

            // if($user->assessment_answers()->first()) {
            //     $user->assessment_answers()->first()->delete();
            // }
            // if($user->client()->first()) {
            //     $user->client()->first()->delete();
            // }
            // if($user->member_purchases()->first()) {
            //     $user->member_purchases()->first()->delete();
            // }
            // $user->customer()->first()->customer_bank_accounts()->each(function($customer_bank_account) {
            //     $customer_bank_account->delete();
            // });
            // $user->customer()->first()->customer_major_suppliers()->each(function($customer_major_supplier) {
            //     $customer_major_supplier->delete();
            // });
            // $user->customer()->first()->customer_contact_people()->each(function($customer_contact_person) {
            //     $customer_contact_person->delete();
            // });

            // $user->customer()->first()->customer_establishment_info()->delete();
            // $user->customer()->first()->delete();
        });
    }

}
