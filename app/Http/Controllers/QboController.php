<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QboController extends Controller
{
    public function qboReportGuestyRevenues(Request $request) {
        $year = $request->year;
        $month = $request->month;

        $monthsListingUnitsWithAmounts = [];
        for ($i=1; $i <= (int)$month -1; $i++) { 
            if($i == 1) {
                $monthsListingUnitsWithAmounts = $this->getListingUnitsWithAmounts($year, $i);
                // dd($monthsListingUnitsWithAmounts);
            } else {
                $_data = $this->getListingUnitsWithAmounts($year, $i);
                
                foreach ($_data as $key => $data) {
                    $listing_unit_key = array_search($data['listing_unit'], array_column($monthsListingUnitsWithAmounts,'listing_unit'));
                    if($listing_unit_key !== false) {
                        $monthsListingUnitsWithAmounts[$listing_unit_key]['netIncome'] = $data['netIncome'];
                    } else {
                        $monthsListingUnitsWithAmounts[] = [
                            'listing_unit' => $data['listing_unit'],
                            'netIncome' => $data['netIncome'],
                        ];
                    }
                }
            }
        }

        // dd($monthsListingUnitsWithAmounts);

        $prevYearListingUnitWithAmount = $this->getListingUnitsWithAmounts((int)$year -1, $month);

        $prevYearMonthsListingUnitsWithAmounts = [];
        for ($i=1; $i <= (int)$month -1; $i++) { 
            if($i == 1) {
                $prevYearMonthsListingUnitsWithAmounts = $this->getListingUnitsWithAmounts((int)$year -1, $i);
            } else {
                $_data = $this->getListingUnitsWithAmounts((int)$year -1, $i);
                foreach ($_data as $key => $data) {
                    $listing_unit_key = array_search($data['listing_unit'], array_column($prevYearMonthsListingUnitsWithAmounts,'listing_unit'));
                    if($listing_unit_key !== false) {
                        $prevYearMonthsListingUnitsWithAmounts[$listing_unit_key]['netIncome'] += $data['netIncome'];
                    } else {
                        $prevYearMonthsListingUnitsWithAmounts[] = [
                            'listing_unit' => $data['listing_unit'],
                            'netIncome' => $data['netIncome']
                        ];
                    }
                }
            }
        }
        // dd($prevYearListingUnitWithAmount);


        

        $reservations = \App\Reservation::where(\DB::raw('YEAR(STR_TO_DATE(checkIn,"%Y-%m-%dT%T"))'),'=',$year)
                                            ->where(\DB::raw('MONTH(STR_TO_DATE(checkIn,"%Y-%m-%dT%T"))'),'=',$month)
                                            ->where(\DB::raw('JSON_EXTRACT(`money`, \'$.totalPaid\')'),'>',0)
                                            ->orderBy(\DB::raw('JSON_EXTRACT(`listing`, \'$.nickname\')'),'asc')
                                            ->get()->toArray();;
        
        $listing_ids = array_column($reservations,'listingId');
        $reservationListings = $this->getReservationListings(implode(',',$listing_ids));
        $reservationListings = json_decode($reservationListings, true);
        foreach ($reservationListings['results'] as $key => $listing) {
            foreach ($reservations as $reservation_key => $reservation) {
                if($reservation['listingId'] == $listing['_id']) {
                    $reservations[$reservation_key]['bedrooms'] = $listing['bedrooms'];
                }
            }
        }
        

        $listingNames = [];
        $listingUnitNames = [];
        foreach ($reservations as $reservation_key => $reservation) {
            $reservations[$reservation_key]['integration'] = json_decode($reservation['integration'], true);
            $reservations[$reservation_key]['money'] = json_decode($reservation['money'], true);
            $reservations[$reservation_key]['customFields'] = json_decode($reservation['customFields'], true);
            $reservations[$reservation_key]['guest'] = json_decode($reservation['guest'], true);
            $reservations[$reservation_key]['listing'] = json_decode($reservation['listing'], true);

            $nickname = explode(' ',$reservations[$reservation_key]['listing']['nickname']);
            $nickname = $nickname[0];

            $listingNames[] = $nickname;

            $listingUnitNames[] = $reservations[$reservation_key]['listing']['nickname'];
        }

        if(array_search('304 NW 32 Upstairs', $listingUnitNames) == false) {
            $listingUnitNames[] = '304 NW 32 Upstairs';
        }
        // print_r($listingUnitNames);

        

        $listingNames = array_unique($listingNames);
        rsort($listingNames);

        $listingsWithAmounts = []; // TO SEND
        $listingTotal = 0; // TO SEND

        
        
        foreach ($listingNames as $key => $listing_name) {
            $total_amount = 0;

            foreach ($reservations as $reservation_key => $reservation) {
                $nickname = explode(' ',$reservations[$reservation_key]['listing']['nickname']);
                $nickname = $nickname[0];
                if($listing_name == $nickname) {
                    $total_amount += $reservation['money']['netIncome'];
                }
            }
            $listingsWithAmounts[] = [
                'listing' => $listing_name,
                'total_amount' => $total_amount
            ];

            $listingTotal += $total_amount;
        }


        

        $listingAerieNonAirbnb = 0; // TO SEND
        $listingTotalPaid = 0; // TO SEND
        $listingBalanceDue = 0; // TO SEND
        foreach ($reservations as $reservation_key => $reservation) {
            $nickname = explode(' ',$reservations[$reservation_key]['listing']['nickname']);
            $nickname = $nickname[0];
            if($nickname == 'Aerie') {
                if($reservation['source'] != 'airbnb2') {
                    $listingAerieNonAirbnb += $reservation['money']['totalPaid'];
                }
            }

            $listingBalanceDue += $reservation['money']['balanceDue'];
            $listingTotalPaid += $reservation['money']['totalPaid'];
        }
        $listingAerieSalesTax = $listingAerieNonAirbnb * 0.07; // TO SEND
        $listingAerieSurtax = $listingAerieNonAirbnb * 0.01; // TO SEND

        $propolisSTRManagementFee = 0.15; // TO SEND
        $strFee = $listingTotal * $propolisSTRManagementFee; // TO SEND


        
        
        $listingUnitNames = array_unique($listingUnitNames);
        sort($listingUnitNames);

        
        $listingUnitsWithAmounts = []; // TO SEND
        $listingUnitsWithAmountsYTDTotal = 0; // TO SEND
        foreach ($listingUnitNames as $key => $listing_unit_name) {
            $bedrooms = 0;
            $total_amount = 0;
            foreach ($reservations as $reservation_key => $reservation) {
                if($listing_unit_name == $reservations[$reservation_key]['listing']['nickname']) {
                    $total_amount += $reservation['money']['netIncome'];
                    $bedrooms = $reservation['bedrooms'];
                }
            }

            $listing_unit = str_replace('Aerie - Unit ','',str_replace('NW 32 ','',str_replace('Aerie - Unit ','',str_replace('NE 25th ','',$listing_unit_name))));
            $listing_unit_key = array_search($listing_unit, array_column($monthsListingUnitsWithAmounts,'listing_unit'));
            $ytd_total = $total_amount;
            $prev_year_netIncome = 0;
            if($listing_unit_key !== false) {
                $ytd_total += $monthsListingUnitsWithAmounts[$listing_unit_key]['netIncome'];
            }

            $prev_year_listing_unit_key = array_search($listing_unit, array_column($prevYearListingUnitWithAmount,'listing_unit'));
            $prev_year_netIncome = 'N/A';
            if($prev_year_listing_unit_key !== false) {
                $prev_year_netIncome = $prevYearListingUnitWithAmount[$prev_year_listing_unit_key]['netIncome'];
                // print_r($total_amount);
                // var_dump($prev_year_netIncome);

                if($prev_year_netIncome > 0) {
                    $prev_year_netIncome = $total_amount / $prev_year_netIncome  -1;
                    $prev_year_netIncome = round($prev_year_netIncome * 100, 2).'%';
                }
                
            }

            // dd($prevYearMonthsListingUnitsWithAmounts);
            $prev_year_month_listing_unit_key = array_search($listing_unit, array_column($prevYearMonthsListingUnitsWithAmounts,'listing_unit'));
            $prev_year_ytd_total = 0;
            $ytd_yoy_change = 'N/A';
            if($prev_year_month_listing_unit_key !== false) {
                $prev_year_ytd_total = $prevYearMonthsListingUnitsWithAmounts[$prev_year_month_listing_unit_key]['netIncome'];
                if($prev_year_ytd_total > 0) {
                    $ytd_yoy_change = $ytd_total / $prev_year_ytd_total -1;   
                    $ytd_yoy_change = round($ytd_yoy_change * 100, 2).'%';
                }
                
            }

            $ytd_prem_vs_long_term = round(($ytd_total / (2800* (int)$month) -1) * 100, 2) . '%';


            $site_units = \App\SiteUnit::where('site_id',1)->where('unit_no',$listing_unit)->get();

            $min_stay = '';
            $type = '';
            if(count($site_units) > 0) {
                $site_units = $site_units->first();
                $min_stay = $site_units->nightly_min_stay;
                $type = $site_units->entire_appartment == 1 ? 'entire apt' : 'bedroom';
            }

            $listingUnitsWithAmountsYTDTotal += $ytd_total;
            $listingUnitsWithAmounts[] = [
                'listing_unit' => $listing_unit,
                'netIncome' => $total_amount,
                'bedrooms' => $bedrooms > 0 ? $bedrooms : '-',
                // 'income_per_room' => $total_amount * $bedrooms,
                'income_per_room' => $bedrooms > 0 ? $total_amount / $bedrooms : '-',
                'ytd_total' => $ytd_total,
                'ytd_per_room' => $bedrooms > 0 ? $ytd_total / $bedrooms : '-',
                'ytd_avg_per_room' => $bedrooms > 0 ? $ytd_total / $bedrooms / (int)$month : '-',
                'ytd_prem_vs_long_term' => $ytd_prem_vs_long_term,
                'current_month_yoy_change' => $prev_year_netIncome,
                'ytd_yoy_change' => $ytd_yoy_change, // $ytd_total / PREV YEAR YTD -1
                'min_stay' => $min_stay,
                'type' => $type
            ];

        }   
        // dd($listingUnitsWithAmounts);

        return response()->json([
            'success' => true,
            'data' => $reservations,
            'listingsWithAmounts' => $listingsWithAmounts,
            'listingTotal' => $listingTotal,
            'propolisSTRManagementFee' => $propolisSTRManagementFee,
            'strFee' => $strFee,
            'listingUnitsWithAmounts' => $listingUnitsWithAmounts,
            'listingAerieNonAirbnb' => $listingAerieNonAirbnb,
            'listingTotalPaid' => $listingTotalPaid,
            'listingBalanceDue' => $listingBalanceDue,
            'listingAerieSalesTax' => $listingAerieSalesTax,
            'listingAerieSurtax' => $listingAerieSurtax,
            'listingUnitsWithAmountsYTDTotal' => $listingUnitsWithAmountsYTDTotal
        ]);
    }

    private function getListingUnitsWithAmounts($year, $month) {
        $reservations = \App\Reservation::select(['id','listingId','listing','money'])->where(\DB::raw('YEAR(STR_TO_DATE(checkIn,"%Y-%m-%dT%T"))'),'=',$year)
                                            ->where(\DB::raw('MONTH(STR_TO_DATE(checkIn,"%Y-%m-%dT%T"))'),'<=',$month)
                                            ->where(\DB::raw('JSON_EXTRACT(`money`, \'$.totalPaid\')'),'>',0)
                                            ->orderBy(\DB::raw('JSON_EXTRACT(`listing`, \'$.nickname\')'),'asc')
                                            ->get()->toArray();;

                                            // dd($reservations);


        $listingUnitNames = [];
        foreach ($reservations as $reservation_key => $reservation) {
            $reservations[$reservation_key]['money'] = json_decode($reservation['money'], true);
            $reservations[$reservation_key]['listing'] = json_decode($reservation['listing'], true);

            $listingUnitNames[] = $reservations[$reservation_key]['listing']['nickname'];
        }

        // if($listingUnitNames)
        
        $listingUnitNames = array_unique($listingUnitNames);
        sort($listingUnitNames);

        
        $listingUnitsWithAmounts = []; // TO SEND
        foreach ($listingUnitNames as $key => $listing_unit_name) {
            $total_amount = 0;
            foreach ($reservations as $reservation_key => $reservation) {
                if($listing_unit_name == $reservations[$reservation_key]['listing']['nickname']) {
                    $total_amount += $reservation['money']['netIncome'];
                }
            }
            $listingUnitsWithAmounts[] = [
                'listing_unit' => str_replace('Aerie - Unit ','',str_replace('NW 32 ','',str_replace('Aerie - Unit ','',str_replace('NE 25th ','',$listing_unit_name)))),
                'netIncome' => $total_amount,
            ];
        }

        return $listingUnitsWithAmounts;

    }

}
