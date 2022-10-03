import {
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Divider,
    Row,
    Statistic,
    Table,
    Tooltip,
    Space,
    Typography
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import toCurrency from "../../../../providers/toCurrency";
import { arrayColumn } from "../../../../providers/arrayColumn";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import React, { useEffect, useState } from "react";
import moment, { isMoment } from "moment";
import Text from "antd/lib/typography/Text";
import {
    SettingOutlined,
    FileExcelOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
// import data from "./data";
// const ReactDragListView = window[""];
import ReactDragListView from "react-drag-listview";

const PageReports = () => {
    const {
        data: dataAuthUrl,
        isLoading: isLoadingDataAuthUrl
    } = useAxiosQuery("GET", "api/qbo/authUrl", "qbo_auth_url", res => {
        console.log(res);
    });
    let ExportFileName = "Reporting  - " + moment().format("YYYY-MM-DD");
    const loginPopupUri = parameter => {
        // Launch Popup
        var parameters = "location=1,width=800,height=650";
        parameters +=
            ",left=" +
            (screen.width - 800) / 2 +
            ",top=" +
            (screen.height - 650) / 2;

        var win = window.open(dataAuthUrl.data, "connectPopup", parameters);
        var pollOAuth = window.setInterval(function() {
            try {
                if (win.document.URL.indexOf("code") != -1) {
                    window.clearInterval(pollOAuth);
                    win.close();
                    location.reload();
                }
            } catch (e) {
                console.log(e);
            }
        }, 100);
    };

    // const {
    //     data: dataCompanyInfo,
    //     isLoading: isLoadingDataCompanyInfo
    // } = useAxiosQuery("GET", "api/qbo/companyInfo", "qbo_companyInfo", res => {
    //     console.log(res);
    // });

    const {
        data: dataReportGeneralLedger,
        isLoading: isLoadingDataReportGeneralLedger
    } = useAxiosQuery(
        "GET",
        "api/qbo/report/generalLedger",
        "qbo_report_general_ledger",
        res => {
            console.log(res);
        }
    );
    const {
        mutate: mutateGetRevenues,
        isLoading: isLoadingMutateGetRevenues
    } = useAxiosQuery(
        "POST",
        "api/qbo/report/guesty_revenues",
        "qbo_report_guesty_revenues"
    );

    const [filterRevenue, setFilterRevenue] = useState(
        moment()
            .subtract(1, "months")
            .format("YYYY-MM")
    );

    // const [testData] = useState(data);

    const [dataRevenues, setDataRevenues] = useState();
    const [csvData1, setCsvData1] = useState([]);

    useEffect(() => {
        if (filterRevenue) {
            let filterYearMonth = filterRevenue;
            filterYearMonth = filterYearMonth.split("-");
            let data = {
                year: filterYearMonth[0],
                month: filterYearMonth[1]
            };
            console.log("filterYearMonth", filterYearMonth);
            mutateGetRevenues(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        if (res.data) {
                            // setDataRevenues(res);

                            console.log("dataVenue", res);
                            var group13 = {
                                listing_unit: "13",
                                income_per_room: 0,
                                netIncome: 0,
                                ytd_avg_per_room: 0,
                                ytd_per_room: 0,
                                current_month_yoy_change: 0,
                                ytd_total: 0,
                                ytd_prem_vs_long_term: 0,
                                ytd_yoy_change: 0,
                                bedrooms: 0,
                                children: []
                            };
                            var group14 = {
                                listing_unit: "14",
                                income_per_room: 0,
                                netIncome: 0,
                                ytd_avg_per_room: 0,
                                ytd_per_room: 0,
                                current_month_yoy_change: 0,
                                ytd_total: 0,
                                ytd_prem_vs_long_term: 0,
                                ytd_yoy_change: 0,
                                bedrooms: 0,
                                children: []
                            };
                            var group23 = {};
                            var group24 = {
                                listing_unit: "24",
                                income_per_room: 0,
                                netIncome: 0,
                                ytd_avg_per_room: 0,
                                ytd_per_room: 0,
                                current_month_yoy_change: 0,
                                ytd_total: 0,
                                ytd_prem_vs_long_term: 0,
                                ytd_yoy_change: 0,
                                bedrooms: 0,
                                children: []
                            };
                            var group33 = {
                                listing_unit: "33",
                                income_per_room: 0,
                                netIncome: 0,
                                ytd_avg_per_room: 0,
                                ytd_per_room: 0,
                                current_month_yoy_change: 0,
                                ytd_total: 0,
                                ytd_prem_vs_long_term: 0,
                                ytd_yoy_change: 0,
                                bedrooms: 0,
                                children: []
                            };
                            res.listingUnitsWithAmounts.forEach((e, ind) => {
                                if (
                                    e.listing_unit == "13A" ||
                                    e.listing_unit == "13B" ||
                                    e.listing_unit == "13C"
                                ) {
                                    group13.income_per_room =
                                        group13.income_per_room +
                                        e.income_per_room;
                                    group13.netIncome =
                                        group13.netIncome + e.netIncome;
                                    group13.ytd_avg_per_room =
                                        group13.ytd_avg_per_room +
                                        e.ytd_avg_per_room;
                                    group13.ytd_total =
                                        group13.ytd_total + e.ytd_total;
                                    group13.ytd_per_room =
                                        group13.ytd_per_room + e.ytd_per_room;
                                    group13.bedrooms =
                                        group13.bedrooms + e.bedrooms;

                                    group13.ytd_prem_vs_long_term =
                                        parseFloat(
                                            e.ytd_prem_vs_long_term != "N/A"
                                                ? e.ytd_prem_vs_long_term.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group13.ytd_prem_vs_long_term;

                                    group13.current_month_yoy_change =
                                        parseFloat(
                                            e.current_month_yoy_change != "N/A"
                                                ? e.current_month_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group13.current_month_yoy_change;

                                    group13.ytd_yoy_change =
                                        parseFloat(
                                            e.ytd_yoy_change != "N/A"
                                                ? e.ytd_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group13.ytd_yoy_change;
                                    group13.type = e.type;
                                    group13.min_stay = e.min_stay;

                                    group13.children = [...group13.children, e];
                                }

                                if (
                                    e.listing_unit == "14A" ||
                                    e.listing_unit == "14B"
                                ) {
                                    group14.income_per_room =
                                        group14.income_per_room +
                                        e.income_per_room;
                                    group14.netIncome =
                                        group14.netIncome + e.netIncome;
                                    group14.ytd_avg_per_room =
                                        group14.ytd_avg_per_room +
                                        e.ytd_avg_per_room;
                                    group14.ytd_total =
                                        group14.ytd_total + e.ytd_total;
                                    group14.ytd_per_room =
                                        group14.ytd_per_room + e.ytd_per_room;

                                    group14.bedrooms =
                                        group14.bedrooms + e.bedrooms;

                                    group14.ytd_prem_vs_long_term =
                                        parseFloat(
                                            e.ytd_prem_vs_long_term != "N/A"
                                                ? e.ytd_prem_vs_long_term.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group14.ytd_prem_vs_long_term;

                                    group14.current_month_yoy_change =
                                        parseFloat(
                                            e.current_month_yoy_change != "N/A"
                                                ? e.current_month_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group14.current_month_yoy_change;

                                    group14.ytd_yoy_change =
                                        parseFloat(
                                            e.ytd_yoy_change != "N/A"
                                                ? e.ytd_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group14.ytd_yoy_change;
                                    group14.type = e.type;
                                    group14.min_stay = e.min_stay;
                                    group14.children = [...group14.children, e];
                                }

                                if (
                                    e.listing_unit == "24 A" ||
                                    e.listing_unit == "24 B"
                                ) {
                                    group24.income_per_room =
                                        group24.income_per_room +
                                        e.income_per_room;
                                    group24.netIncome =
                                        group24.netIncome + e.netIncome;
                                    group24.ytd_avg_per_room =
                                        group24.ytd_avg_per_room +
                                        e.ytd_avg_per_room;
                                    group24.ytd_total =
                                        group24.ytd_total + e.ytd_total;
                                    group24.ytd_per_room =
                                        group24.ytd_per_room + e.ytd_per_room;

                                    group24.bedrooms =
                                        group24.bedrooms + e.bedrooms;

                                    group24.ytd_prem_vs_long_term =
                                        parseFloat(
                                            e.ytd_prem_vs_long_term != "N/A"
                                                ? e.ytd_prem_vs_long_term.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group24.ytd_prem_vs_long_term;

                                    group24.current_month_yoy_change =
                                        parseFloat(
                                            e.current_month_yoy_change != "N/A"
                                                ? e.current_month_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group24.current_month_yoy_change;

                                    group24.ytd_yoy_change =
                                        parseFloat(
                                            e.ytd_yoy_change != "N/A"
                                                ? e.ytd_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group24.ytd_yoy_change;
                                    group24.type = e.type;
                                    group24.min_stay = e.min_stay;
                                    group24.children = [...group24.children, e];
                                }
                                if (
                                    e.listing_unit == "33A" ||
                                    e.listing_unit == "33B" ||
                                    e.listing_unit == "33C"
                                ) {
                                    group33.income_per_room =
                                        group33.income_per_room +
                                        e.income_per_room;
                                    group33.netIncome =
                                        group33.netIncome + e.netIncome;
                                    group33.ytd_avg_per_room =
                                        group33.ytd_avg_per_room +
                                        e.ytd_avg_per_room;
                                    group33.ytd_total =
                                        group33.ytd_total + e.ytd_total;
                                    group33.ytd_per_room =
                                        group33.ytd_per_room + e.ytd_per_room;
                                    group33.bedrooms =
                                        group33.bedrooms + e.bedrooms;

                                    group33.ytd_prem_vs_long_term =
                                        parseFloat(
                                            e.ytd_prem_vs_long_term != "N/A"
                                                ? e.ytd_prem_vs_long_term.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group33.ytd_prem_vs_long_term;

                                    group33.current_month_yoy_change =
                                        parseFloat(
                                            e.current_month_yoy_change != "N/A"
                                                ? e.current_month_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group33.current_month_yoy_change;

                                    group33.ytd_yoy_change =
                                        parseFloat(
                                            e.ytd_yoy_change != "N/A"
                                                ? e.ytd_yoy_change.replace(
                                                      "%",
                                                      ""
                                                  )
                                                : 0
                                        ) + group33.ytd_yoy_change;
                                    group33.type = e.type;
                                    group33.min_stay = e.min_stay;
                                    group33.children = [...group33.children, e];
                                }
                                if (e.listing_unit == "23 OLD") {
                                    group23 = { ...e };
                                }
                            });

                            // ytd_per_room
                            group13.ytd_per_room =
                                group13.ytd_per_room / group13.bedrooms;
                            group14.ytd_per_room =
                                group14.ytd_per_room / group14.bedrooms;
                            group23.ytd_per_room =
                                group23.ytd_per_room / group23.bedrooms;
                            group24.ytd_per_room =
                                group24.ytd_per_room / group24.bedrooms;
                            group33.ytd_per_room =
                                group33.ytd_per_room / group33.bedrooms;

                            // ytd_avg_per_room
                            group13.ytd_avg_per_room =
                                group13.ytd_avg_per_room / data.month;
                            group14.ytd_avg_per_room =
                                group14.ytd_avg_per_room / data.month;
                            group23.ytd_avg_per_room =
                                group23.ytd_avg_per_room / data.month;
                            group24.ytd_avg_per_room =
                                group24.ytd_avg_per_room / data.month;
                            group33.ytd_avg_per_room =
                                group33.ytd_avg_per_room / data.month;

                            // ytd_prem_vs_long_term
                            group13.ytd_prem_vs_long_term =
                                group13.ytd_prem_vs_long_term != 0
                                    ? Math.round(
                                          (group13.ytd_total /
                                              (2800 * data.month) -
                                              1) *
                                              100,
                                          2
                                      ) + "%"
                                    : "N/A";
                            group14.ytd_prem_vs_long_term =
                                group14.ytd_prem_vs_long_term != 0
                                    ? Math.round(
                                          (group14.ytd_total /
                                              (2800 * data.month) -
                                              1) *
                                              100,
                                          2
                                      ) + "%"
                                    : "N/A";
                            group23.ytd_prem_vs_long_term =
                                group23.ytd_prem_vs_long_term != 0
                                    ? Math.round(
                                          (group23.ytd_total /
                                              (2800 * data.month) -
                                              1) *
                                              100,
                                          2
                                      ) + "%"
                                    : "N/A";
                            group24.ytd_prem_vs_long_term =
                                group24.ytd_prem_vs_long_term != 0
                                    ? Math.round(
                                          (group24.ytd_total /
                                              (2800 * data.month) -
                                              1) *
                                              100,
                                          2
                                      ) + "%"
                                    : "N/A";
                            group33.ytd_prem_vs_long_term =
                                group33.ytd_prem_vs_long_term != 0
                                    ? Math.round(
                                          (group33.ytd_total /
                                              (2800 * data.month) -
                                              1) *
                                              100,
                                          2
                                      ) + "%"
                                    : "N/A";

                            var index = res.listingUnitsWithAmounts.length - 1;
                            while (index >= 0) {
                                if (
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "13A" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "13B" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "13C" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "14A" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "14B" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "24 A" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "24 B" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "33A" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "33B" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "33C" ||
                                    res.listingUnitsWithAmounts[index]
                                        .listing_unit === "23 OLD"
                                ) {
                                    res.listingUnitsWithAmounts.splice(
                                        index,
                                        1
                                    );
                                }

                                index -= 1;
                            }
                            // console.log(group24);

                            res.listingUnitsWithAmounts.push({
                                ...group13,
                                // ytd_prem_vs_long_term:
                                //     group13.ytd_prem_vs_long_term != 0
                                //         ? String(
                                //               group13.ytd_prem_vs_long_term.toFixed(
                                //                   2
                                //               )
                                //           ) + "%"
                                //         : "N/A",
                                ytd_yoy_change:
                                    group13.ytd_yoy_change != 0
                                        ? String(
                                              group13.ytd_yoy_change.toFixed(2)
                                          ) + "%"
                                        : "N/A",
                                current_month_yoy_change:
                                    group13.current_month_yoy_change != 0
                                        ? String(
                                              group13.current_month_yoy_change.toFixed(
                                                  2
                                              )
                                          ) + "%"
                                        : "N/A",

                                income_per_room:
                                    group13.income_per_room / group13.bedrooms
                            });
                            res.listingUnitsWithAmounts.push({
                                ...group14,
                                // ytd_prem_vs_long_term:
                                //     group14.ytd_prem_vs_long_term != 0
                                //         ? String(
                                //               group14.ytd_prem_vs_long_term.toFixed(
                                //                   2
                                //               )
                                //           ) + "%"
                                //         : "N/A",
                                ytd_yoy_change:
                                    group14.ytd_yoy_change != 0
                                        ? String(
                                              group14.ytd_yoy_change.toFixed(2)
                                          ) + "%"
                                        : "N/A",
                                current_month_yoy_change:
                                    group14.current_month_yoy_change != 0
                                        ? String(
                                              group14.current_month_yoy_change.toFixed(
                                                  2
                                              )
                                          ) + "%"
                                        : "N/A",
                                income_per_room:
                                    group14.income_per_room / group14.bedrooms
                            });
                            res.listingUnitsWithAmounts.push({
                                ...group23
                            });
                            res.listingUnitsWithAmounts.push({
                                ...group24,
                                // ytd_prem_vs_long_term:
                                //     group24.ytd_prem_vs_long_term != 0
                                //         ? String(
                                //               group24.ytd_prem_vs_long_term.toFixed(
                                //                   2
                                //               )
                                //           ) + "%"
                                //         : "N/A",
                                ytd_yoy_change:
                                    group24.ytd_yoy_change != 0
                                        ? String(
                                              group24.ytd_yoy_change.toFixed(2)
                                          ) + "%"
                                        : "N/A",
                                current_month_yoy_change:
                                    group24.current_month_yoy_change != 0
                                        ? String(
                                              group24.current_month_yoy_change.toFixed(
                                                  2
                                              )
                                          ) + "%"
                                        : "N/A",
                                income_per_room:
                                    group24.income_per_room / group24.bedrooms
                            });
                            res.listingUnitsWithAmounts.push({
                                ...group33,
                                // ytd_prem_vs_long_term:
                                //     group33.ytd_prem_vs_long_term != 0
                                //         ? String(
                                //               group33.ytd_prem_vs_long_term.toFixed(
                                //                   2
                                //               )
                                //           ) + "%"
                                //         : "N/A",
                                ytd_yoy_change:
                                    group33.ytd_yoy_change != 0
                                        ? String(
                                              group33.ytd_yoy_change.toFixed(2)
                                          ) + "%"
                                        : "N/A",
                                current_month_yoy_change:
                                    group33.current_month_yoy_change != 0
                                        ? String(
                                              group33.current_month_yoy_change.toFixed(
                                                  2
                                              )
                                          ) + "%"
                                        : "N/A",
                                income_per_room:
                                    group33.income_per_room / group33.bedrooms
                            });

                            var arr = [];
                            let hostFee = [];
                            let discTotal = [];
                            let adjTotal = [];
                            let taxTotal = [];
                            let cleanFareTotal = [];
                            let fareAccomTotal = [];
                            let netIncomeTotal = [];
                            let fareAccomAdjTotal = [];
                            let subTotalPriceTotal = [];
                            let guestTaxesTotal = [];
                            let hostPayoutTotal = [];
                            let commissionTotal = [];
                            let commissionTaxPercentageTotal = [];
                            let commissionTax = [];
                            let commissionIncTaxTax = [];
                            let ownerRevenueTotal = [];
                            let totalRefundedTotal = [];
                            res.data.forEach((e, ind) => {
                                let checkIn = e.checkIn;
                                let checkOut = e.checkOut;
                                let confirmedAt = e.confirmedAt;
                                let createdAt = e.createdAt;
                                if (checkIn) {
                                    checkIn = checkIn.split("T");
                                    checkIn = checkIn[0];

                                    checkIn = checkIn.split("-");
                                    checkIn.shift();
                                    checkIn = checkIn.join("-");
                                }
                                if (checkOut) {
                                    checkOut = checkOut.split("T");
                                    checkOut = checkOut[0];
                                    checkOut = checkOut.split("-");
                                    checkOut.shift();
                                    checkOut = checkOut.join("-");
                                }
                                if (confirmedAt) {
                                    confirmedAt = confirmedAt.split("T");
                                    confirmedAt = confirmedAt[0];
                                    confirmedAt = confirmedAt.split("-");
                                    confirmedAt.shift();
                                    confirmedAt = confirmedAt.join("-");
                                }
                                if (createdAt) {
                                    createdAt = createdAt.split("T");
                                    createdAt = createdAt[0];
                                    createdAt = createdAt.split("-");
                                    createdAt.shift();
                                    createdAt = createdAt.join("-");
                                }

                                arr.push({
                                    nickname: e.listing.nickname,
                                    checkIn: checkIn,
                                    checkOut: checkOut,
                                    nightsCount: e.nightsCount,
                                    fullName: e.guest.fullName,
                                    source: e.source,
                                    createdAt: createdAt,
                                    netIncome: e.money.netIncome,
                                    confirmedAt: confirmedAt,
                                    fareAccommodation:
                                        e.money.fareAccommodation,
                                    fareCleaning: e.money.fareCleaning,
                                    totalTaxes: e.money.totalTaxes,
                                    fareAccommodationAdjustment:
                                        e.money.fareAccommodationAdjustment,
                                    fareAccommodationDiscount:
                                        e.money.fareAccommodationDiscount,
                                    cancelFee: "",
                                    hostServiceFee: e.money.hostServiceFee,
                                    balanceDue: e.money.balanceDue,
                                    totalPaid: e.money.totalPaid,
                                    balances: "", // accounting.balances
                                    folioStatus: "", // accounting.folioStatus
                                    advancedDeposit: "", // accounting.balances.advancedDeposit
                                    ownerRevenue: "", // accounting.analytics.ownerRevenue
                                    cash: "", // accounting.balances.cash
                                    cash: "", // accounting.balances.cash
                                    accountsPayable: "", // accounting.balances.accountsPayable
                                    isLocked: "", // money.invoiceItems.isLocked
                                    fareAccommodationAdjusted:
                                        e.money.fareAccommodationAdjusted,
                                    subTotalPrice: e.money.subTotalPrice,
                                    guestServiceFee: e.money.guestServiceFee,
                                    guestTaxes: e.money.guestTaxes,
                                    guestTotalPrice: e.money.guestTotalPrice,
                                    hostServiceFeeTax:
                                        e.money.hostServiceFeeTax,
                                    hostPayout: e.money.hostPayout,
                                    hostServiceFeeIncTax:
                                        e.money.hostServiceFeeIncTax,
                                    netIncomeFormula: e.money.netIncomeFormula,
                                    commissionFormula:
                                        e.money.commissionFormula,
                                    commission: e.money.commission,
                                    commissionTaxPercentage:
                                        e.money.commissionTaxPercentage,
                                    commissionTax: e.money.commissionTax,
                                    commissionIncTax: e.money.commissionIncTax,
                                    ownerRevenue: e.money.ownerRevenue,
                                    CITY_TAX: e.money.invoiceItems["CITY_TAX"],
                                    VAT: e.money.invoiceItems["VAT"],
                                    GOODS_AND_SERVICES_TAX:
                                        e.money.invoiceItems[
                                            "GOODS_AND_SERVICES_TAX"
                                        ],
                                    LOCAL_TAX:
                                        e.money.invoiceItems["LOCAL_TAX"],
                                    TOURISM_TAX:
                                        e.money.invoiceItems["TOURISM_TAX"],
                                    tax: e.money.invoiceItems.tax,
                                    Property_Tax:
                                        e.money.invoiceItems.Property_Tax,
                                    "Additional_Fees_&_Room_Fees":
                                        e.money.invoiceItems[
                                            "Additional_Fees_&_Room_Fees"
                                        ],
                                    Damage_Fee: e.money.invoiceItems.Damage_Fee,
                                    Damage_Waiver:
                                        e.money.invoiceItems.Damage_Waiver,
                                    Guest_service_fee:
                                        e.money.invoiceItems.Guest_service_fee,
                                    Length_of_stay_discount:
                                        e.money.invoiceItems
                                            .Length_of_stay_discount,
                                    fareAccommodation: "", //e.preCancelationMoney.fareAccommodation
                                    fareCleaning: "", //e.preCancelationMoney.fareCleaning
                                    hostServiceFee: "", //e.preCancelationMoney.hostServiceFee
                                    hostPayout: "", //e.preCancelationMoney.hostPayout
                                    description: "", //e.money.coupon.description,
                                    code: "", // e.money.coupon.code,
                                    coupon: "", //e.money.coupon,
                                    discountValue: "", //e.money.coupon.discountValue,
                                    valueSaved: "", //e.money.coupon.valueSaved,
                                    name: "", //e.ratePlan.name,
                                    cancellationPolicy: "", //e.ratePlan.cancellationPolicy,
                                    mealPlan: "", //e.ratePlan.mealPlan,
                                    promotionDataName: "", //e.ratePlan.promotionData.name,
                                    Cleaning_fee: "", //e.money.invoiceItems.Cleaning_fee,
                                    Sales_Tax: "", //e.money.invoiceItems.Sales_Tax,
                                    Lodging_Tax: "", //e.money.invoiceItems.Lodging_Tax,
                                    Host_channel_fee: "", //e.money.invoiceItems['Host_channel_fee" data-sort="money.invoiceItems.Host_channel_fee'],
                                    Cancellation_Fee: "", //e.additionalFeeItem.SERVICE.Cancellation_Fee,
                                    Deposit: "", //e.additionalFeeItem.DEPOSIT.Deposit,
                                    Late_checkout: "", //e.additionalFeeItem.LATE_CHECKOUT.Late_checkout,
                                    Early_Checkin: "", //e.additionalFeeItem.EARLY_CHECK_IN.Early_Checkin,
                                    EXPEDIA_AFE: "", //e.additionalFeeItem.EXPEDIA_AFE.EXPEDIA_AFE,
                                    alteredAt: e.alteredAt,
                                    canceledAt: e.canceledAt,
                                    plannedArrival: e.plannedArrival,
                                    plannedDeparture: e.plannedDeparture,
                                    specialRequests: "", //e.specialRequests
                                    transportation: "", //e.transportation,
                                    reasonForVisit: "", //e.reasonForVisit,
                                    plannedArrival: "", //e.nextReservation.plannedArrival
                                    // source: "", //e.source,
                                    _id: "", //e._id,
                                    platform: "", // e.integration.platform,
                                    // nickname: "", // e.integration.nickname,
                                    confirmationCode: "", // e.confirmationCode,
                                    public: "", // e.review.guestReview.public,
                                    createdAt: "", // e.review.guestReview.createdAt,
                                    private: "", // e.review.guestReview.private,
                                    status: "", // e.status,
                                    canceledBy: "", // e.canceledBy,
                                    cancelationRequestStatus: "", // e.cancelationRequestStatus,
                                    cancellationReason: "", // e.cancellationReason,
                                    cleaning: "", // e.notes.cleaning,
                                    guest: "", // e.notes.guest,
                                    other: "", // e.notes.other,
                                    "604bda2c937b110030025197": "", // e.customFields["604bda2c937b110030025197"],
                                    "604bda2c937b110030025196": "", // e.customFields["604bda2c937b110030025196"],
                                    "604bda2c937b110030025195": "", // e.customFields["604bda2c937b110030025195"],
                                    "604bda2c937b110030025194": "", //e.customFields["604bda2c937b110030025194"],
                                    dataId: "", // e.guestsCount,
                                    email: "", // e.guest.email,
                                    dataId: "", // e.guest.emails,
                                    phone: "", // e.guest.phone,
                                    phones: "", // "", //e.guest.phones,
                                    hometown: "", // e.guest.hometown,
                                    notes: "", // e.guest.notes,
                                    maritalStatus: "", // e.guest.maritalStatus,
                                    gender: "", // e.guest.gender,
                                    pronouns: "", // e.guest.pronouns,
                                    birthday: "", // e.guest.birthday,
                                    preferredLanguage: "", // e.guest.preferredLanguage,
                                    kids: "", // e.guest.kids,
                                    interests: "", // e.guest.interests,
                                    allergies: "", // e.guest.allergies,
                                    dietaryPreferences: "", // e.guest.dietaryPreferences,
                                    goodToKnowNotes: "", // e.guest.goodToKnowNotes,
                                    nationality: "", // e.guest.nationality,
                                    passportNumber: "", // e.guest.passportNumber,
                                    didentityNumbertaId: "", // e.guest.identityNumber
                                    listing: "", // e.listing,
                                    // nickname: "", // e.listing.nickname,
                                    tags: "", // e.listing.tags,
                                    title: "", // e.listing.title,
                                    full: "", // e.listing.address.full,
                                    full: "", // e.listing.publishedAddress.full,
                                    city: "", // e.listing.address.city,
                                    city: "", // e.listing.publishedAddress.city,
                                    _id: "", // e.integration._id,
                                    datpropertyTypeaId: "", // e.listing.propertyType,
                                    roomType: "", // e.listing.roomType,
                                    type: "", // e.listing.type,
                                    accommodates: "", // e.listing.accommodates,
                                    bedrooms: "", // e.listing.bedrooms,
                                    beds: "", // e.listing.beds,
                                    instructions: "", // e.listing.cleaning.instructions,
                                    bathrooms: "", // e.listing.bathrooms,
                                    areaSquareFeet: "", // e.listing.areaSquareFeet,
                                    value: "", // e.listing.cleaningStatus.value,
                                    "5ecbe1bace9239002c55bd80": "", // e.customFields['5ecbe1bace9239002c55bd80'],
                                    "5ecbe1c993075d002df8b73a": "", // e.customFields['5ecbe1c993075d002df8b73a'],
                                    "604647714608a2002f461bc8": "", // e.customFields['604647714608a2002f461bc8'],
                                    "5fd11472763a9d002ee9d8b5": "", // e.customFields['5fd11472763a9d002ee9d8b5'],
                                    "6074bfe62336080031d77cea": "", // e.customFields["6074bfe62336080031d77cea"],
                                    "6160a07d71b7090030935f70": "", // e.customFields['6160a07d71b7090030935f70'],
                                    accountName: "", //e.money.paymentProvider.accountName,
                                    confirmationCode: "", //e.money.payments.confirmationCode,
                                    totalPaid: e.money.totalPaid,
                                    totalRefunded: "", //e.money.totalRefunded,
                                    status: "", // e.sharedInvoice.status,
                                    sentAt: "", // e.sharedInvoice.sentAt,
                                    paidAt: "" // e.sharedInvoice.paidAt
                                });

                                if (e.money.hostServiceFee) {
                                    hostFee.push(e.money.hostServiceFee);
                                }
                                if (e.money.fareAccommodationDiscount) {
                                    discTotal.push(
                                        e.money.fareAccommodationDiscount
                                    );
                                }
                                if (e.money.fareAccommodationAdjustment) {
                                    adjTotal.push(
                                        e.money.fareAccommodationAdjustment
                                    );
                                }
                                if (e.money.totalTaxes) {
                                    taxTotal.push(e.money.totalTaxes);
                                }
                                if (e.money.fareCleaning) {
                                    cleanFareTotal.push(e.money.fareCleaning);
                                }
                                if (e.money.fareAccommodation) {
                                    fareAccomTotal.push(
                                        e.money.fareAccommodation
                                    );
                                }
                                if (e.money.netIncome) {
                                    netIncomeTotal.push(e.money.netIncome);
                                }
                                if (e.money.fareAccommodationAdjusted) {
                                    fareAccomAdjTotal.push(
                                        e.money.fareAccommodationAdjusted
                                    );
                                }
                                if (e.money.subTotalPrice) {
                                    subTotalPriceTotal.push(
                                        e.money.subTotalPrice
                                    );
                                }
                                if (e.money.guestTaxes) {
                                    guestTaxesTotal.push(e.money.guestTaxes);
                                }
                                if (e.money.hostPayout) {
                                    hostPayoutTotal.push(e.money.hostPayout);
                                }
                                if (e.money.commission) {
                                    commissionTotal.push(e.money.commission);
                                }
                                if (e.money.commissionTaxPercentage) {
                                    commissionTaxPercentageTotal.push(
                                        e.money.commissionTaxPercentage
                                    );
                                }
                                if (e.money.commissionTax) {
                                    commissionTax.push(e.money.commissionTax);
                                }
                                if (e.money.commissionIncTax) {
                                    commissionIncTaxTax.push(
                                        e.money.commissionIncTax
                                    );
                                }
                                if (e.money.ownerRevenue) {
                                    ownerRevenueTotal.push(
                                        e.money.ownerRevenue
                                    );
                                }
                                if (e.money.totalRefunded) {
                                    totalRefundedTotal.push(
                                        e.money.totalRefunded
                                    );
                                }
                            });
                            setCsvData1(arr);

                            let result = {
                                ...res,
                                hostFee: hostFee.reduce((a, b) => a + b, 0),
                                discTotal: discTotal.reduce((a, b) => a + b, 0),
                                adjTotal: adjTotal.reduce((a, b) => a + b, 0),
                                taxTotal: taxTotal.reduce((a, b) => a + b, 0),
                                cleanFareTotal: cleanFareTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                fareAccomTotal: fareAccomTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                netIncomeTotal: netIncomeTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                fareAccomAdjTotal: fareAccomAdjTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                subTotalPriceTotal: subTotalPriceTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                guestTaxesTotal: guestTaxesTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                hostPayoutTotal: hostPayoutTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                commissionTotal: commissionTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                commissionTaxPercentageTotal: commissionTaxPercentageTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                commissionTax: commissionTax.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                commissionIncTaxTax: commissionIncTaxTax.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                ownerRevenueTotal: ownerRevenueTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                                totalRefundedTotal: totalRefundedTotal.reduce(
                                    (a, b) => a + b,
                                    0
                                )
                            };
                            setDataRevenues(result);
                        }
                    }
                }
            });
        }
        return () => {};
    }, [filterRevenue]);

    let showColumns = [
        { dataId: "listing.nickname", title: "Listing's nickname" },
        { dataId: "checkIn", title: "Check In" },
        { dataId: "checkOut", title: "Check Out" },
        { dataId: "nightsCount", title: "Number of nights", abrv: "NIGHTS" },
        { dataId: "guest.fullName", title: "Guest's name" },
        { dataId: "source", title: "Source" },
        { dataId: "createdAt", title: "Creation date" },
        {
            dataId: "money.netIncome",
            title: "Net income"
        },
        {
            dataId: "confirmedAt",
            title: "Confirmation date",
            abrv: "CONF DATE"
        },
        {
            dataId: "money.fareAccommodation",
            title: "Accommodation fare",
            abrv: "ACCOMM FARE"
        },

        {
            dataId: "money.fareCleaning",
            title: "Cleaning fare",
            abrv: "CLEAN FARE"
        },
        {
            dataId: "money.totalTaxes",
            title: "Total taxes",
            abrv: "TAX"
        },
        {
            dataId: "money.fareAccommodationAdjustment",
            title: "Accommodation fare adjustment",
            abrv: "ADJ"
        },
        {
            dataId: "money.fareAccommodationDiscount",
            title: "Accommodation fare Discount",
            abrv: "DISC"
        },
        {
            dataId: "money.invoiceItems.Cancellation_fee",
            title: "Cancellation fee",
            abrv: "CNCL FEE"
        },
        {
            dataId: "money.hostServiceFee",
            title: "Channel Commission",
            abrv: "HOST FEE"
        },
        {
            dataId: "money.balanceDue",
            title: "Balance due"
        },
        {
            dataId: "money.totalPaid",
            title: "Total paid"
        }
    ];

    let tableColumns = [
        {
            label: "Financials",
            children: [
                {
                    dataId: "accounting.balances",
                    title: "Processed by Business Model"
                },
                {
                    dataId: "accounting.folioStatus",
                    title: "Folio Status"
                },
                {
                    dataId: "accounting.balances.advancedDeposit",
                    title: "Advanced Deposit Balance"
                },
                {
                    dataId: "accounting.analytics.ownerRevenue",
                    title: "Owner Net Revenue (Accounting)"
                },
                {
                    dataId: "accounting.balances.cash",
                    title: "Cash Balance"
                },
                {
                    dataId: "accounting.balances.accountsPayable",
                    title: "Accounts Payable Balance"
                },
                {
                    dataId: "money.invoiceItems.isLocked",
                    title: "Suggested Action"
                },
                {
                    dataId: "money.fareAccommodation",
                    title: "Accommodation fare",
                    abrv: "ACCOM FARE"
                },
                {
                    dataId: "money.fareAccommodationAdjusted",
                    title: "Net accommodation fare"
                },
                {
                    dataId: "money.fareAccommodationDiscount",
                    title: "Accommodation fare Discount",
                    abrv: "DISC"
                },
                {
                    dataId: "money.fareAccommodationAdjustment",
                    title: "Accommodation fare adjustment",
                    abrv: "ADJ"
                },
                {
                    dataId: "money.balanceDue",
                    title: "Balance due"
                },
                {
                    dataId: "money.invoiceItems.Cancellation_fee",
                    title: "Cancellation fee",
                    abrv: "CNCL FEE"
                },
                {
                    dataId: "money.fareCleaning",
                    title: "Cleaning fare",
                    abrv: "CLEAN FARE"
                },
                {
                    dataId: "money.subTotalPrice",
                    title: "Subtotal price"
                },
                {
                    dataId: "money.guestServiceFee",
                    title: "Guest's channel fee"
                },
                {
                    dataId: "money.guestTaxes",
                    title: "Guest's taxes"
                },
                {
                    dataId: "money.guestTotalPrice",
                    title: "Guest's total price"
                },
                {
                    dataId: "money.hostServiceFee",
                    title: "Channel Commission",
                    abrv: "HOST FEE"
                },
                {
                    dataId: "money.hostServiceFeeTax",
                    title: "Channel Commission Tax"
                },
                {
                    dataId: "money.hostPayout",
                    title: "Total payout"
                },
                {
                    dataId: "money.hostServiceFeeIncTax",
                    title: "Channel Commission Incl Tax"
                },
                {
                    dataId: "money.netIncomeFormula",
                    title: "Net income formula"
                },
                {
                    dataId: "money.netIncome",
                    title: "Net income"
                },
                {
                    dataId: "money.commissionFormula",
                    title: "Commission formula"
                },
                {
                    dataId: "money.commission",
                    title: "Commission"
                },
                {
                    dataId: "money.commissionTaxPercentage",
                    title: "Commission tax percentage"
                },
                {
                    dataId: "money.commissionTax",
                    title: "Commission tax"
                },
                {
                    dataId: "money.commissionIncTax",
                    title: "Commission inc. tax"
                },
                {
                    dataId: "money.ownerRevenue",
                    title: "Owner Net Revenue"
                },
                {
                    dataId: "money.invoiceItems.CITY_TAX",
                    title: "CITY TAX"
                },
                {
                    dataId: "money.invoiceItems.VAT",
                    title: "VAT"
                },
                {
                    dataId: "money.invoiceItems.GOODS_AND_SERVICES_TAX",
                    title: "GOODS AND SERVICES TAX"
                },
                {
                    dataId: "money.invoiceItems.LOCAL_TAX",
                    title: "LOCAL TAX"
                },
                {
                    dataId: "money.invoiceItems.TOURISM_TAX",
                    title: "TOURISM TAX"
                },
                {
                    dataId: "money.invoiceItems.tax",
                    title: "TAX"
                },
                {
                    dataId: "money.invoiceItems.Property_Tax",
                    title: "Property tax"
                },
                {
                    dataId: "money.invoiceItems.Additional_Fees_&_Room_Fees",
                    title: "Additional Fees & Room Fees"
                },
                {
                    dataId: "money.invoiceItems.Damage_Fee",
                    title: "Damage Fee"
                },
                {
                    dataId: "money.invoiceItems.Damage_Waiver",
                    title: "Damage Waiver"
                },
                {
                    dataId: "money.invoiceItems.Guest_service_fee",
                    title: "Guest service fee"
                },
                {
                    dataId: "money.invoiceItems.Length_of_stay_discount",
                    title: "Length of stay discount"
                },
                {
                    dataId: "preCancelationMoney.fareAccommodation",
                    title: "Canceled accommodation fare"
                },
                {
                    dataId: "preCancelationMoney.fareCleaning",
                    title: "Canceled cleaning fee"
                },
                {
                    dataId: "preCancelationMoney.hostServiceFee",
                    title: "Canceled host service fee"
                },
                {
                    dataId: "preCancelationMoney.hostPayout",
                    title: "Canceled total payout"
                },
                {
                    dataId: "money.totalTaxes",
                    title: "Total taxes",
                    abrv: "TAX"
                },
                {
                    dataId: "money.coupon.description",
                    title: "Coupon internal name"
                },
                {
                    dataId: "money.coupon.code",
                    title: "Coupon code"
                },
                {
                    dataId: "money.coupon",
                    title: "Coupon applied"
                },
                {
                    dataId: "money.coupon.discountValue",
                    title: "Coupon percentage"
                },
                {
                    dataId: "money.coupon.valueSaved",
                    title: "Coupon discount"
                },
                {
                    dataId: "ratePlan.name",
                    title: "Rate-Plan name"
                },
                {
                    dataId: "ratePlan.cancellationPolicy",
                    title: "Cancellation policy"
                },
                {
                    dataId: "ratePlan.mealPlan",
                    title: "Meal plan"
                },
                {
                    dataId: "ratePlan.promotionData.name",
                    title: "Promotion name"
                },
                {
                    dataId: "money.invoiceItems.Cleaning_fee",
                    title: "Cleaning fee"
                },
                {
                    dataId: "money.invoiceItems.Sales_Tax",
                    title: "Sales Tax"
                },
                {
                    dataId: "money.invoiceItems.Lodging_Tax",
                    title: "Lodging Tax"
                },
                {
                    dataId:
                        'money.invoiceItems.Host_channel_fee" data-sort="money.invoiceItems.Host_channel_fee',
                    title: "Host channel fee"
                },
                {
                    dataId: "additionalFeeItem.SERVICE.Cancellation_Fee",
                    title: "SERVICE (Cancellation Fee)"
                },
                {
                    dataId: "additionalFeeItem.DEPOSIT.Deposit",
                    title: "DEPOSIT (Deposit)"
                },
                {
                    dataId: "additionalFeeItem.LATE_CHECKOUT.Late_checkout",
                    title: "LATE_CHECKOUT (Late checkout)"
                },
                {
                    dataId: "additionalFeeItem.EARLY_CHECK_IN.Early_Checkin",
                    title: "EARLY_CHECK_IN (Early Checkin)"
                },
                {
                    dataId: "additionalFeeItem.EXPEDIA_AFE.EXPEDIA_AFE",
                    title: "EXPEDIA_AFE (EXPEDIA_AFE)"
                }
            ]
        },
        {
            label: "Reservation",
            children: [
                {
                    dataId: "createdAt",
                    title: "Creation date"
                },
                {
                    dataId: "confirmedAt",
                    title: "Confirmation date",
                    abrv: "CONF DATE"
                },
                {
                    dataId: "alteredAt",
                    title: "Alteration date"
                },
                {
                    dataId: "canceledAt",
                    title: "Cancellation date"
                },
                { dataId: "checkIn", title: "Check In", show: true },
                {
                    dataId: "checkOut",
                    title: "Check Out",
                    show: true
                },
                {
                    dataId: "nightsCount",
                    title: "Number of nights",
                    abrv: "NIGHTS",
                    show: true
                },
                {
                    dataId: "plannedArrival",
                    title: "Planned arrival"
                },
                {
                    dataId: "plannedDeparture",
                    title: "Planned departure"
                },
                {
                    dataId: "specialRequests",
                    title: "Special requests"
                },
                {
                    dataId: "transportation",
                    title: "transportation methods"
                },
                {
                    dataId: "reasonForVisit",
                    title: "Reason for visit"
                },
                {
                    dataId: "nextReservation.plannedArrival",
                    title: "Next Planned Arrival"
                },
                { dataId: "source", title: "Source" },
                {
                    dataId: "_id",
                    title: "Reservation Id"
                },
                {
                    dataId: "integration.platform",
                    title: "Platform"
                },
                {
                    dataId: "integration.nickname",
                    title: "Integration"
                },
                {
                    dataId: "confirmationCode",
                    title: "Confirmation Code"
                },
                {
                    dataId: "review.guestReview.public",
                    title: "Guest's public review"
                },
                {
                    dataId: "review.guestReview.createdAt",
                    title: "Guest's review created at"
                },
                {
                    dataId: "review.guestReview.private",
                    title: "Guest's private review"
                },
                { dataId: "status", title: "Status" },
                {
                    dataId: "canceledBy",
                    title: "Canceled by"
                },
                {
                    dataId: "cancelationRequestStatus",
                    title: "Cancelation request status"
                },
                {
                    dataId: "cancellationReason",
                    title: "Cancelation reason"
                },
                {
                    dataId: "notes.cleaning",
                    title: "Cleaning notes"
                },
                {
                    dataId: "notes.guest",
                    title: "Guest notes"
                },
                {
                    dataId: "notes.other",
                    title: "Other notes"
                },
                {
                    dataId: "customFields.604bda2c937b110030025197",
                    title: "AHP_RISK_SCORE"
                },
                {
                    dataId: "customFields.604bda2c937b110030025196",
                    title: "AHP_RISK_COLOR"
                },
                {
                    dataId: "customFields.604bda2c937b110030025195",
                    title: "AHP_GUEST_PORTAL_COMPLETED"
                },
                {
                    dataId: "customFields.604bda2c937b110030025194",
                    title: "AHP_AUTOHOST_VERIFIED_STATUS"
                }
            ]
        },
        {
            label: "Guest",
            children: [
                {
                    dataId: "guestsCount",
                    title: "Number of guests"
                },
                {
                    dataId: "guest.fullName",
                    title: "Guest's name",
                    show: true
                },
                {
                    dataId: "guest.email",
                    title: "Guest's email"
                },
                {
                    dataId: "guest.emails",
                    title: "Guest's other emails"
                },
                {
                    dataId: "guest.phone",
                    title: "Guest's phone"
                },
                {
                    dataId: "guest.phones",
                    title: "Guest's other phones"
                },
                {
                    dataId: "guest.hometown",
                    title: "Guest's hometown"
                },
                {
                    dataId: "guest.notes",
                    title: "Attention note"
                },
                {
                    dataId: "guest.maritalStatus",
                    title: "Marital Status"
                },
                {
                    dataId: "guest.gender",
                    title: "Gender"
                },
                {
                    dataId: "guest.pronouns",
                    title: "Pronouns"
                },
                {
                    dataId: "guest.birthday",
                    title: "Birthday"
                },
                {
                    dataId: "guest.preferredLanguage",
                    title: "Preferred Language"
                },
                {
                    dataId: "guest.kids",
                    title: "Number of kids"
                },
                {
                    dataId: "guest.interests",
                    title: "Interests"
                },
                {
                    dataId: "guest.allergies",
                    title: "Allergies"
                },
                {
                    dataId: "guest.dietaryPreferences",
                    title: "Dietary preferences"
                },
                {
                    dataId: "guest.goodToKnowNotes",
                    title: "Good to know note"
                },
                { dataId: "guest.tags", title: "Tags" },
                {
                    dataId: "guest.nationality",
                    title: "Nationality"
                },
                {
                    dataId: "guest.passportNumber",
                    title: "Passport number"
                },
                {
                    dataId: "guest.identityNumber",
                    title: "Identity card number"
                }
            ]
        },
        {
            label: "Listing",
            children: [
                { dataId: "listing", title: "Listing" },
                {
                    dataId: "listing.nickname",
                    title: "Listing's nickname",
                    show: true
                },
                {
                    dataId: "listing.tags",
                    title: "Listing's tags"
                },
                {
                    dataId: "listing.title",
                    title: "Listing's title"
                },
                {
                    dataId: "listing.address.full",
                    title: "Listing's address"
                },
                {
                    dataId: "listing.publishedAddress.full",
                    title: "Listing's published address"
                },
                {
                    dataId: "listing.address.city",
                    title: "Listing's city"
                },
                {
                    dataId: "listing.publishedAddress.city",
                    title: "Listing's publish city"
                },
                {
                    dataId: "integration._id",
                    title: "Listing's external id"
                },
                {
                    dataId: "listing.propertyType",
                    title: "Type of property"
                },
                {
                    dataId: "listing.roomType",
                    title: "Type of room"
                },
                {
                    dataId: "listing.type",
                    title: "Type of unit"
                },
                {
                    dataId: "listing.accommodates",
                    title: "Occupancy"
                },
                {
                    dataId: "listing.bedrooms",
                    title: "Number of bedrooms"
                },
                {
                    dataId: "listing.beds",
                    title: "Number of beds"
                },
                {
                    dataId: "listing.cleaning.instructions",
                    title: "Cleaning instructions"
                },
                {
                    dataId: "listing.bathrooms",
                    title: "Number of bathrooms"
                },
                {
                    dataId: "listing.areaSquareFeet",
                    title: "Area (sqft"
                },
                {
                    dataId: "listing.cleaningStatus.value",
                    title: "Cleaning status"
                },
                {
                    dataId: "customFields.5ecbe1bace9239002c55bd80",
                    title: "checkininstructions"
                },
                {
                    dataId: "customFields.5ecbe1c993075d002df8b73a",
                    title: "checkoutinstructions"
                },
                {
                    dataId: "customFields.604647714608a2002f461bc8",
                    title: "lockboxcode"
                },
                {
                    dataId: "customFields.5fd11472763a9d002ee9d8b5",
                    title: "apartmentnumber"
                },
                {
                    dataId: "customFields.6074bfe62336080031d77cea",
                    title: "room"
                },
                {
                    dataId: "customFields.6160a07d71b7090030935f70",
                    title: "additionalaccessinstructions"
                }
            ]
        },
        {
            label: "Payments",
            children: [
                {
                    dataId: "money.paymentProvider.accountName",
                    title: "PAYMENT PROVIDER ACCOUNT"
                },
                {
                    dataId: "money.payments.confirmationCode",
                    title: "PAYMENT CONFIRMATION CODES"
                },
                {
                    dataId: "money.totalPaid",
                    title: "TOTAL PAID"
                },
                {
                    dataId: "money.totalRefunded",
                    title: "TOTAL REFUNDED"
                }
            ]
        },
        {
            label: "Share guest invoice",
            children: [
                {
                    dataId: "sharedInvoice.status",
                    title: "INVOICE STATUS"
                },
                {
                    dataId: "sharedInvoice.sentAt",
                    title: "INVOICE SENT DATE"
                },
                {
                    dataId: "sharedInvoice.paidAt",
                    title: "INVOICE PAID DATE"
                }
            ]
        }
    ];
    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_reports_table_v2
            ? JSON.parse(localStorage.column_settings_reports_table_v2)
            : showColumns
    });

    const [activeTableColumns, setActiveTableColumns] = useState();

    useEffect(() => {
        // if (showTableColumnSettings.data.length > 0) {
        let row = [];
        showTableColumnSettings.data.map((item, key) => {
            row.push({
                title: item.title,
                key: item.dataId
            });
        });
        setActiveTableColumns(row);
        // }
    }, [showTableColumnSettings.data]);

    const getDataFromArray = (record, dataId) => {
        let _dataId = dataId.split(".");
        // console.log(_dataId);
        let dataIdCount = _dataId.length;
        let _data = record;
        if (_data[_dataId[0]]) {
            if (dataIdCount == 1) {
                _data = _data[_dataId[0]];
            }
            if (dataIdCount == 2) {
                _data = _data[_dataId[0]][_dataId[1]];
            }
            if (dataIdCount == 3) {
                _data = _data[_dataId[0]][_dataId[1]][_dataId[2]];
            }
            if (dataIdCount == 4) {
                _data = _data[_dataId[0]][_dataId[1]][_dataId[2]][_dataId[3]];
            }
        } else {
            return null;
        }

        return _data;
    };

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const handleExpandRow = (expanded, record) => {
        const keys = [];
        if (expanded) {
            keys.push(record.listing_unit); // I have set my record.id as row key. Check the documentation for more details.
        }

        setExpandedRowKeys(keys);
    };

    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            var intlCode = match[1] ? "+1 " : "";
            return [
                intlCode,
                "(",
                match[2],
                ") ",
                match[3],
                "-",
                match[4]
            ].join("");
        }
        return null;
    }

    const [csvHeader, setcsvHeader] = useState([]);
    useEffect(() => {
        // console.log("showTableColumnSettings", showTableColumnSettings);
        let row = [];
        showTableColumnSettings.data.map((item, key) => {
            let data = item.dataId.split(".");
            let keyVal = "";
            if (data[3]) {
                keyVal = data[3];
            } else {
                if (data[2]) {
                    keyVal = data[2];
                } else {
                    if (data[1]) {
                        keyVal = data[1];
                    } else {
                        keyVal = data[0];
                    }
                }
            }
            row.push({
                label: item.title,
                key: keyVal
            });
        });
        console.log("showTableColumnSettings", row);
        setcsvHeader(row);
    }, [showTableColumnSettings]);

    return (
        <Card className="berry-card reportsCard">
            Filter
            <br />
            <DatePicker
                picker="month"
                value={filterRevenue ? moment(filterRevenue) : ""}
                onChange={(value, dateString) => {
                    console.log(dateString);
                    setFilterRevenue(dateString != "" ? dateString : null);
                }}
                disabledDate={current => {
                    // Can not select days before today and today
                    return (
                        current && current < moment("2022-05-01").endOf("month")
                    );
                }}
            />
            <br />
            <div className="table-responsive">
                <Table
                    className="tbl_reports_table"
                    dataSource={dataRevenues ? dataRevenues.data : []}
                    pagination={false}
                    loading={isLoadingMutateGetRevenues}
                    // footer={() => {
                    //     return (
                    //         <div style={{ textAlign: "right" }}>
                    //             <Statistic
                    //                 title="TOTAL BALANCE DUE"
                    //                 value={
                    //                     dataRevenues &&
                    //                     toCurrency(
                    //                         dataRevenues.listingBalanceDue
                    //                     )
                    //                 }
                    //                 prefix="$"
                    //             />
                    //             <Statistic
                    //                 title="TOTAL PAID"
                    //                 value={
                    //                     dataRevenues &&
                    //                     toCurrency(
                    //                         dataRevenues.listingTotalPaid
                    //                     )
                    //                 }
                    //                 prefix="$"
                    //             />
                    //         </div>
                    //     );
                    // }}
                    summary={() => {
                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    {showTableColumnSettings &&
                                        showTableColumnSettings.data.map(
                                            (column, column_key) => {
                                                // console.log("rowData", rowData);
                                                let dataId = column.dataId;
                                                let data = "";

                                                if (
                                                    dataId === "money.totalPaid"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.listingTotalPaid
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.balanceDue"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.listingBalanceDue
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.hostServiceFee"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.hostFee
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.fareAccommodationDiscount"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.discTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.fareAccommodationAdjustment"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.adjTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.totalTaxes"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.taxTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.fareCleaning"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.cleanFareTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.fareAccommodation"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.fareAccomTotal
                                                        );
                                                }
                                                if (
                                                    dataId === "money.netIncome"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.netIncomeTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.fareAccommodationAdjusted"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.fareAccomAdjTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.subTotalPrice"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.subTotalPriceTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.guestTaxes"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.guestTaxesTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.hostPayout"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.hostPayoutTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.commission"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.commissionTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.commissionTaxPercentage"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.commissionTaxPercentageTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.commissionTax"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.commissionTax
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.commissionIncTax"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.commissionIncTaxTax
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.ownerRevenue"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.ownerRevenueTotal
                                                        );
                                                }
                                                if (
                                                    dataId ===
                                                    "money.totalRefunded"
                                                ) {
                                                    data =
                                                        dataRevenues &&
                                                        toCurrency(
                                                            dataRevenues.totalRefundedTotal
                                                        );
                                                }

                                                return (
                                                    <Table.Summary.Cell
                                                        index={column_key}
                                                    >
                                                        {data !== ""
                                                            ? `$${
                                                                  data
                                                                      ? data
                                                                      : 0
                                                              }`
                                                            : ""}
                                                    </Table.Summary.Cell>
                                                );
                                            }
                                        )}
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                    scroll={{
                        x: 2000,
                        y: 450
                    }}
                >
                    {showTableColumnSettings &&
                        showTableColumnSettings.data.map(
                            (column, column_key) => {
                                let title = column.title.toUpperCase();
                                if (column.abrv) {
                                    title = (
                                        <Tooltip
                                            title={column.title.toUpperCase()}
                                        >
                                            {column.abrv.toUpperCase()}
                                        </Tooltip>
                                    );
                                }

                                let dataId = column.dataId;

                                let defaultSortOrder = false;

                                if (dataId == "listing.nickname") {
                                    defaultSortOrder = "ascend";
                                }

                                return (
                                    <Table.Column
                                        width="100px"
                                        title={title}
                                        key={dataId}
                                        sorter={(a, b) => {
                                            let dataA = getDataFromArray(
                                                a,
                                                dataId
                                            );
                                            let dataB = getDataFromArray(
                                                b,
                                                dataId
                                            );

                                            // console.log("dataA", dataA);

                                            if (moment(dataA).isValid()) {
                                                return (
                                                    moment(dataA).unix() -
                                                    moment(dataB).unix()
                                                );
                                            }

                                            return dataA.localeCompare(dataB);
                                        }}
                                        defaultSortOrder={defaultSortOrder}
                                        render={(text, record) => {
                                            let data = getDataFromArray(
                                                record,
                                                dataId
                                            );

                                            if (data) {
                                                if (dataId == "nightsCount") {
                                                    return data;
                                                }

                                                if (
                                                    isNaN(data.toString()) ==
                                                    false
                                                ) {
                                                    if (
                                                        dataId == "guest.phone"
                                                    ) {
                                                        return (
                                                            <>
                                                                {formatPhoneNumber(
                                                                    data
                                                                )}
                                                            </>
                                                        );
                                                    } else {
                                                        return (
                                                            <>
                                                                $
                                                                {toCurrency(
                                                                    data
                                                                )}
                                                            </>
                                                        );
                                                    }
                                                } else {
                                                    if (
                                                        dataId ==
                                                        "guest.fullName"
                                                    ) {
                                                        if (data.length > 11) {
                                                            let _data = data.substr(
                                                                0,
                                                                10
                                                            );
                                                            return (
                                                                <Tooltip
                                                                    title={data}
                                                                >
                                                                    {_data}
                                                                    ...
                                                                </Tooltip>
                                                            );
                                                        } else {
                                                            return data;
                                                        }
                                                    }

                                                    if (
                                                        dataId ==
                                                        "listing.nickname"
                                                    ) {
                                                        if (
                                                            dataId ==
                                                            "listing.nickname"
                                                        ) {
                                                            // console.log(data);
                                                        }
                                                        let _data = data.replace(
                                                            " - Unit",
                                                            ""
                                                        );
                                                        if (_data.length > 14) {
                                                            _data = data.substr(
                                                                0,
                                                                13
                                                            );
                                                            return (
                                                                <Tooltip
                                                                    title={data}
                                                                >
                                                                    {_data}
                                                                    ...
                                                                </Tooltip>
                                                            );
                                                        } else {
                                                            return _data;
                                                        }
                                                    }

                                                    if (
                                                        moment(data).isValid()
                                                    ) {
                                                        data = data.split("T");
                                                        data = data[0];

                                                        data = data.split("-");
                                                        data.shift();
                                                        data = data.join("-");
                                                        return data;
                                                    }

                                                    return data;
                                                }
                                            } else {
                                                // console.log("dataId", dataId);
                                                // console.log("data", data);
                                            }
                                        }}
                                    />
                                );
                            }
                        )}

                    {/* <Table.Column
                        width="90px"
                        title="LISTING'S NICKNAME"
                        key="LISTING'S NICKNAME"
                        sorter={(a, b) =>
                            a.listing.nickname.localeCompare(a.listing.nickname)
                        }
                        defaultSortOrder="ascend"
                        render={(text, record) => {
                            return record.listing.nickname;
                        }}
                    />


                    <Table.Column
                        width="80px"
                        title="CHECK IN"
                        key="CHECK IN"
                        sorter={(a, b) =>
                            moment(a.checkIn).unix() - moment(b.checkIn).unix()
                        }
                        render={(text, record) => {
                            if (record.checkIn) {
                                let checkIn = record.checkIn;
                                checkIn = checkIn.split("T");
                                checkIn = checkIn[0];

                                checkIn = checkIn.split("-");
                                checkIn.shift();
                                checkIn = checkIn.join("-");
                                return checkIn;
                            }
                        }}
                    />

                    <Table.Column
                        width="80px"
                        title="CHECK OUT"
                        key="CHECK OUT"
                        sorter={(a, b) =>
                            moment(a.checkOut).unix() -
                            moment(b.checkOut).unix()
                        }
                        render={(text, record) => {
                            if (record.checkOut) {
                                let checkOut = record.checkOut;
                                checkOut = checkOut.split("T");
                                checkOut = checkOut[0];

                                checkOut = checkOut.split("-");
                                checkOut.shift();
                                checkOut = checkOut.join("-");
                                return checkOut;
                            }
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title="NIGHTS"
                        key="NIGHTS"
                        render={(text, record) => {
                            let diff = moment.duration(
                                moment(record.checkOut).diff(record.checkIn)
                            );
                            let days = diff.asDays();
                            return (
                                <div style={{ textAlign: "center" }}>
                                    {Math.round(days)}
                                </div>
                            );
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title="GUEST'S NAME"
                        key="GUEST'S NAME"
                        render={(text, record) => {
                            let guestName = record.guest.fullName;
                            if (guestName.length > 11) {
                                guestName = guestName.substr(0, 10);
                                return (
                                    <Tooltip title={record.guest.fullName}>
                                        {guestName}...
                                    </Tooltip>
                                );
                            }

                            return guestName;
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title="SOURCE"
                        key="SOURCE"
                        render={(text, record) => {
                            return record.source;
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title={
                            <Tooltip title="CREATION DATE">CREAT DATE</Tooltip>
                        }
                        key="CREATION DATE"
                        render={(text, record) => {
                            if (record.createdAt) {
                                let createdAt = record.createdAt;
                                createdAt = createdAt.split("T");
                                createdAt = createdAt[0];

                                createdAt = createdAt.split("-");
                                createdAt.shift();
                                createdAt = createdAt.join("-");
                                return createdAt;
                            }
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title="NET INCOME"
                        key="NET INCOME"
                        render={(text, record) => {
                            return <>${toCurrency(record.money.netIncome)}</>;
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title={
                            <Tooltip title="CONFIRMATION DATE">
                                CONF DATE
                            </Tooltip>
                        }
                        key="CONFIRMATION DATE"
                        render={(text, record) => {
                            if (record.confirmedAt) {
                                let confirmedAt = record.confirmedAt;
                                confirmedAt = confirmedAt.split("T");
                                confirmedAt = confirmedAt[0];

                                confirmedAt = confirmedAt.split("-");
                                confirmedAt.shift();
                                confirmedAt = confirmedAt.join("-");
                                return confirmedAt;
                            }
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title={
                            <Tooltip title="ACCOMMODATION FARE">
                                ACCOM FARE
                            </Tooltip>
                        }
                        key="ACCOMMODATION FARE"
                        render={(text, record) => {
                            return (
                                <>
                                    $
                                    {toCurrency(record.money.fareAccommodation)}
                                </>
                            );
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title={
                            <Tooltip title="CLEANING FARE">CLEAN FARE</Tooltip>
                        }
                        key="CLEANING FARE"
                        render={(text, record) => {
                            let fareCleaning = toCurrency(
                                record.money.fareCleaning
                            );
                            fareCleaning = fareCleaning.replace(".00", "");
                            return (
                                <>${toCurrency(record.money.fareCleaning)}</>
                            );
                        }}
                    />
                    <Table.Column
                        width="70px"
                        title="TAX"
                        key="TAX"
                        render={(text, record) => {
                            return <>${toCurrency(record.money.totalTaxes)}</>;
                        }}
                    />
                    <Table.Column
                        width="70px"
                        title={<Tooltip title="ADJUSTMENT">ADJ</Tooltip>}
                        key="ADJUSTMENT"
                        render={(text, record) => {
                            // return <div style={{ textAlign: "center" }}>-</div>;
                            return (
                                <>
                                    $
                                    {toCurrency(
                                        record.money.fareAccommodationAdjustment
                                    )}
                                </>
                            );
                        }}
                    />
                    <Table.Column
                        width="70px"
                        title={<Tooltip title="DISCOUNT">DISC</Tooltip>}
                        key="DISCOUNT"
                        render={(text, record) => {
                            // let discount = record.money.invoiceItems.find(
                            //     p => p.type == "DISCOUNT"
                            // );
                            // return <>${discount ? discount.amount : 0}</>;
                            return (
                                <>
                                    $
                                    {toCurrency(
                                        record.money.fareAccommodationDiscount
                                    )}
                                </>
                            );
                        }}
                    />
                    <Table.Column
                        width="70px"
                        title={
                            <Tooltip title="CANCELLATION FEE">CNCL FEE</Tooltip>
                        }
                        key="CANCELLATION FEE"
                        render={(text, record) => {
                            let cancellation_fee = record.money.invoiceItems.find(
                                p => p.type == "CANCELLATION_FEE"
                            );
                            return (
                                <>
                                    $
                                    {cancellation_fee
                                        ? cancellation_fee.amount
                                        : 0}
                                </>
                            );
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title="HOST FEE"
                        key="HOST FEE"
                        render={(text, record) => {
                            return <>-${record.money.hostServiceFee}</>;
                        }}
                    />
                    <Table.Column
                        width="80px"
                        title="BALANCE DUE"
                        key="BALANCE DUE"
                        render={(text, record) => {
                            return <>${record.money.balanceDue}</>;
                        }}
                    />

                    <Table.Column
                        width="80px"
                        title="TOTAL PAID"
                        key="TOTAL PAID"
                        render={(text, record) => {
                            return <>${record.money.totalPaid}</>;
                        }}
                    /> */}
                </Table>
            </div>
            <br />
            <Row>
                <Col xs={24} md={12}>
                    {dataRevenues &&
                        dataRevenues.listingsWithAmounts.map((listing, key) => {
                            return (
                                <Statistic
                                    key={key}
                                    title={`Subtotal ${listing.listing}`}
                                    value={toCurrency(listing.total_amount)}
                                    prefix="$"
                                />
                            );
                        })}
                    <Statistic
                        title={`Total`}
                        value={
                            dataRevenues &&
                            toCurrency(dataRevenues.listingTotal)
                        }
                        prefix="$"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Statistic
                        title={`Aerie (non Airbnb revenue)`}
                        value={
                            dataRevenues &&
                            toCurrency(dataRevenues.listingAerieNonAirbnb)
                        }
                        prefix="$"
                    />
                    <Statistic
                        title={`Aerie Sales Tax`}
                        value={
                            dataRevenues &&
                            toCurrency(dataRevenues.listingAerieSalesTax)
                        }
                        prefix="$"
                    />
                    <Statistic
                        title={`Aerie Surtax`}
                        value={
                            dataRevenues &&
                            toCurrency(dataRevenues.listingAerieSurtax)
                        }
                        prefix="$"
                    />
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col xs={24} md={12}>
                    <Statistic
                        title={`Propolis STR management fee`}
                        value={
                            dataRevenues &&
                            dataRevenues.propolisSTRManagementFee * 100
                        }
                        suffix="%"
                    />
                    <Statistic
                        title={`STR fee`}
                        value={dataRevenues && toCurrency(dataRevenues.strFee)}
                        prefix="$"
                    />
                </Col>
            </Row>
            <Divider />
            <div style={{ float: "right" }}>
                {" "}
                <CSVLink
                    headers={[
                        { label: "Unit", key: "listing_unit" },
                        { label: "Net Income", key: "netIncome" },
                        { label: "Bedrooms", key: "bedrooms" },
                        { label: "Income/Room", key: "income_per_room" },
                        { label: "YTD Total", key: "ytd_total" },
                        { label: "YTD/Room", key: "ytd_per_room" },
                        {
                            label: "YTD Average Per Room",
                            key: "ytd_avg_per_room"
                        },
                        {
                            label: "YTD Premium VS Long Term",
                            key: "ytd_prem_vs_long_term"
                        },
                        {
                            label: "Current Month YoY Change",
                            key: "current_month_yoy_change"
                        },
                        {
                            label: "YTD YOY Change",
                            key: "current_month_yoy_change"
                        },
                        {
                            label: "Min Stay",
                            key: "min_stay"
                        },
                        {
                            label: "Type",
                            key: "type"
                        }
                    ]}
                    data={
                        dataRevenues ? dataRevenues.listingUnitsWithAmounts : []
                    }
                    filename={ExportFileName + ".csv"}
                >
                    <Button icon={<DownloadOutlined />}></Button>
                </CSVLink>
            </div>
        </Card>
    );
};

export default PageReports;
