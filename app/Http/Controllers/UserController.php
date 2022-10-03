<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\CivilStatus;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $users = \App\User::where(function($q) use ($request) {
        //     if($request->search) {
        //         $search = str_replace(' ','+',$request->search);
        //         $q->where('name','LIKE',"%$search%")
        //         ->orWhere('email','LIKE',"%$search%")
        //         ->orWhere('role','LIKE',"%$search%");
        //     }
        // });

        // if($request->advisors_only) {
        //     $users->where('role', 'Advisor');
        //     $users->with('firm');
        //     return response()->json([
        //         'success' => true,
        //         'data' => $users->get()
        //     ]);
        // }

        // if(auth()->user()->role == 'Advisor') {
        //     if($request->advisor_ids) {
        //         if($request->advisor_ids != '') {
        //             $advisor_ids = explode(',',$request->advisor_ids);
        //             // $users->whereIn('client_id',$advisor_ids);
        //         }
        //     }  else if($request->client_ids) {
        //         if($request->client_ids != 'empty') {
        //             $client_ids = explode(',',$request->client_ids);
        //             $users->whereIn('id',$client_ids);
        //         } else {
        //             $users->where('id',0);
        //         }
        //     }  else {
        //         // $user = \App\User::find(12);
        //         $user_client_groups = auth()->user()->user_client_groups()->with(['client_group','client_group.user_client_groups','client_group.user_client_groups.user' => function($q) {
        //             $q->with('client');
        //         }])->get()->pluck('client_group')->pluck('user_client_groups');
        //         $user_ids = [];
        //         foreach ($user_client_groups as $key => $user_client_group) {
        //             foreach ($user_client_group as $key => $user_client) {
        //                 if($user_client->user) {
        //                     $user_ids[] = $user_client->user->id;
        //                 }
        //             }
        //         }
        //         $auth_user = auth()->user();
        //         $users->where(function($q) use($auth_user,$user_ids) {
        //             $q->orWhere('client_id',$auth_user->client()->first()->id);
        //             $q->orWhereIn('id',$user_ids);
        //         });
        //         $users->where('role','Client');
        //     }
        // } else {
        //     // QUERY TO GET ADMIN AND AdVISOR ONLY
        //     $users->where(function($query){
        //         $query->where('role', 'Advisor');
        //         $query->orWhere(function($query){
        //                         $query->where('role', 'Client')
        //                                 ->where('client_id','<>',null);
        //                     });
        //         $query->orWhere('role', 'Admin');
        //     });
        // }
        // if($request->users_clients) {
        //     $users->where('role','Client');
        //     $users->where('client_id','<>',null);
        // }
        // $users->with('user_client_groups');
        // $users->with(['member_purchases' => function($query) {
        //     $query->where('reporttype','mpa');
        // }]);
        // $users->with('member_client');
        // $users->with('member_client.user');
        // if($request->sort_order != '') {
        //     if($request->sort_field == "org_name"){
        //         $users->select('users.*')->leftjoin('clients', 'users.client_id', '=', 'clients.id')->orderBy('clients.org_name', $request->sort_order == 'ascend' ? 'asc' : 'desc');

        //     }else{
        //         $users->orderBy($request->sort_field, $request->sort_order == 'ascend' ? 'asc' : 'desc');
        //     }

        // }

        // $users_all = $users->get()->toArray();
        // $users = $users->paginate(50)->toArray();


        // $data = collect($users['data']);
        // $data_all = collect($users_all);

        // $primaryData = [
        //     [
        //         'type' => "Saver",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Spender",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Risk Taker",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Security Seeker",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Flyer",
        //         'value' => 0
        //     ]
        // ];
        // $secondaryData = [
        //     [
        //         'type' => "Saver",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Spender",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Risk Taker",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Security Seeker",
        //         'value' => 0
        //     ],
        //     [
        //         'type' => "Flyer",
        //         'value' => 0
        //     ]
        // ];
        // foreach ($data as $key => $user) {
        //     if(count($user['member_purchases']) > 0) {
        //         $users['data'][$key]['member_purchase'] = $users['data'][$key]['member_purchases'][0];
        //     }
        // }
        // foreach ($data as $key => $user) {
        //     if(isset($users['data'][$key]['member_purchase'])) {
        //         $users['data'][$key]['member_purchase']['reportdata'] = $users['data'][$key]['member_purchase']['reporttype'] == 'fis' ? $users['data'][$key]['member_purchase']['reportdata'] : (unserialize($users['data'][$key]['member_purchase']['reportdata']));
        //         if($users['data'][$key]['member_purchase']['reporttype'] == 'mpa') {
        //                 $answers = \App\AssessmentAnswer::where("user_id",$user['id'])->get();

        //                 if(count($answers)!=0){
        //                     foreach($answers as $keyaa => $aa){
        //                         $str = $aa['answers'];
        //                         $res = explode("q51=", $str);
        //                         $users['data'][$key]['answers']=$res[1];
        //                     }
        //                 }
        //         }
        //     }
        // }

        // foreach ($data_all as $key => $user) {
        //     if(count($user['member_purchases']) > 0) {
        //         $users_all[$key]['member_purchase'] = $users_all[$key]['member_purchases'][0];
        //     }
        // }
        // foreach ($data_all as $key => $user) {
        //     if(isset($users[$key]['member_purchase'])) {
        //         $users[$key]['member_purchase']['reportdata'] = $users[$key]['member_purchase']['reporttype'] == 'fis' ? $users[$key]['member_purchase']['reportdata'] : (unserialize($users[$key]['member_purchase']['reportdata']));

        //     }

        //     if(isset($users_all[$key]['member_purchase'])) {
        //         if($users_all[$key]['member_purchase']['reporttype'] == 'mpa') {
        //             $users_all[$key]['member_purchase']['reportdata'] = $users_all[$key]['member_purchase']['reporttype'] == 'fis' ? $users_all[$key]['member_purchase']['reportdata'] : (unserialize($users_all[$key]['member_purchase']['reportdata']));
        //             $primary_key = array_search($users_all[$key]['member_purchase']['reportdata']['primary'],array_column($primaryData, 'type'));
        //             $secondary_key = array_search($users_all[$key]['member_purchase']['reportdata']['secondary'],array_column($secondaryData, 'type'));
        //             $primaryData[$primary_key]['value']++;
        //             $secondaryData[$secondary_key]['value']++;
        //         }
        //     }


        // }


        // return response()->json([
        //     'success' => true,
        //     'data' => $users,
        //     'data_all' => $users_all,
        //     'primaryData' => $primaryData,
        //     'secondaryData' => $secondaryData,
        //     'request' => $request->all()

        // ],200);

    }

    public function get_users(Request $request)
    {
        $data = new User;
        $data = $data->select([
            'users.*',
        ]);
        $data->where(function ($q) use ($request) {
            $q->orWhere('name', 'LIKE', "%$request->search%");
            $q->orWhere('email', 'LIKE', "%$request->search%");
            $q->orWhere('phone', 'LIKE', "%$request->search%");
            $q->orWhere('role', 'LIKE', "%$request->search%");
        });


        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                if ($request->sort_field == "date") {
                    $data->orderBy('', isset($request->sort_order)  ? $request->sort_order : 'desc');
                } else {
                    $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
                }
            }
        } else {
            $data->orderBy('id', 'desc');
        }

        $data = $data
            ->limit($request->page_size)
            ->paginate($request->page_size, ['*'], 'page', $request->page_number)->toArray();

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::updateOrCreate(
            ['id' => $request->id],[
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            // 'password_plain' => ($request->password),
            'role' => $request->role
        ]);

        // if ($request->upload) {
        //     $user->upload = $request->upload;
        //     $user->save();
        // }

        if ($request->file('upload')) {
            $userImageFile = $request->file('upload');
            // $userImageFileName = $userImageFile->getClientOriginalName();
            // $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = time();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile', $userImageFilePath, 'public');
            // $userImageFileSize = $this->formatSizeUnits($userImageFile->getSize());

            $user->upload = 'storage/'.$userImageFilePath;
            $user->save();
        }

        // $image = base64_decode($request->upload);
        return response()->json([
            'success' => true,
            // 'data' => $image
        ],200);
    }

    public function store_update(Request $request)
    {
        $user = User::updateOrCreate(
            ['id' => $request->id],[
            'name' => $request->name,
            'phone' => $request->phone,
            'role' => $request->role
        ]);

        if ($request->file('upload')) {
            $userImageFile = $request->file('upload');
            // $userImageFileName = $userImageFile->getClientOriginalName();
            // $userImageFilePath = time() . '_' . $userImageFile->getClientOriginalName();
            $userImageFilePath = time();
            $userImageFilePath = $userImageFile->storeAs('uploads/profile', $userImageFilePath, 'public');
            // $userImageFileSize = $this->formatSizeUnits($userImageFile->getSize());

            $user->upload = 'storage/'.$userImageFilePath;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ],200);
    }

    public function store_update_password(Request $request)
    {
        $user = User::updateOrCreate(
            ['id' => $request->id],[
            'password' => bcrypt($request->password)
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ],200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = User::find($id);


        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'data not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ],200);
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
        $user = User::find($request->id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found'
            ], 400);
        }

        $updated = $user->fill($request->all())->save();

        if($request->password != '') {
            $user->password = bcrypt($request->password);
            $user->password_plain = $request->password;
            $user->save();
        }

        if ($updated)
            return response()->json([
                'success' => true,
                'data' => $request->all()
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'User could not be updated'
            ], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User with id ' . $id . ' not found'
            ], 400);
        }

        if ($user->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User could not be deleted'
            ], 500);
        }
    }


    // public function get_clients(Request $request) {
    //     $user = auth()->user();

    //     $users = \App\User::where(function($q) use ($request) {
    //         if($request->search) {
    //             $search = str_replace(' ','+',$request->search);
    //             $q->where('name','LIKE',"%$search%")
    //             ->orWhere('email','LIKE',"%$search%")
    //             ->orWhere('role','LIKE',"%$search%");
    //         }
    //     });

    //     $user_client_groups = $user->user_client_groups()->with(['client_group','client_group.user_client_groups','client_group.user_client_groups.user' => function($q) {
    //         $q->with('client');
    //     }])->get()->pluck('client_group')->pluck('user_client_groups');
    //     $user_ids = [];
    //     foreach ($user_client_groups as $key => $user_client_group) {
    //         foreach ($user_client_group as $key => $user_client) {
    //             if($user_client->user) {
    //                 $user_ids[] = $user_client->user->id;
    //             }
    //         }
    //     }
    //     $auth_user = $user;
    //     $users->where(function($q) use($auth_user,$user_ids) {
    //         $q->orWhere('client_id',$auth_user->client()->first()->id);
    //         $q->orWhereIn('id',$user_ids);
    //     });
    //     $users->where('role','Client');

    //     $users->with(['member_purchases' => function($query) {
    //         $query->where('reporttype','mpa');
    //     }]);
    //     $users = $users->get()->toArray();

    //     foreach ($users as $key => $user) {
    //         if(count($user['member_purchases']) > 0) {
    //             $users[$key]['member_purchase'] = $users[$key]['member_purchases'][0];
    //         }
    //     }
    //     foreach ($users as $key => $user) {
    //         if(isset($users[$key]['member_purchase'])) {
    //             $users[$key]['member_purchase']['reportdata'] = $users[$key]['member_purchase']['reporttype'] == 'fis' ? $users[$key]['member_purchase']['reportdata'] : (unserialize($users[$key]['member_purchase']['reportdata']));
    //         }
    //     }

    //     $clients = [];
    //     foreach ($users as $key => $user) {
    //         $clients[] = array(
    //             'fullname' =>$user['name'], // NAME
    //             'email' => $user['email'], // EMAIL
    //             'phone' => $user['phone'], // PHONE
    //             'primary' => isset($user['member_purchase']) ? $user['member_purchase']['reportdata']['primary'] : '', // PRIMARY
    //             'secondary' => isset($user['member_purchase']) ? $user['member_purchase']['reportdata']['secondary'] : ''// SECONDARY
    //         );
    //     }
    //     return response()->json([
    //         'success' => true,
    //         'data' => $clients
    //     ]);
    // }

}
