// ==============================|| WIDGET - MARKET SHARE CHART ||============================== //

import { border } from "@mui/system";

const chartData = {
    height: 400,

    options: {
        chart: {
            id: "market-sale-chart",

            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
            // sparkline: {
            //     enabled: true
            // }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "smooth",
            width: 3,
            dashArray: [3, 3, 0, 0, 3]
        },
        // fill: {
        //     type: "gradient",
        //     gradient: {
        //         shadeIntensity: 1,
        //         opacityFrom: 0.5,
        //         opacityTo: 0,
        //         stops: [0, 80, 100]
        //     }
        // },
        markers: {
            size: 5,
            hover: {
                sizeOffset: 3
            }
        },
        legend: {
            show: true
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]
        },
        grid: {
            borderColor: "#f1f1f1",
            // borderWidth: 4,
            // display: true,
            drawborder: true
        },

        yaxis: {
            min: 0,
            max: 100,
            stepSize: 10,
            title: {
                text: "USD"
            },
            labels: {
                show: true
            }
        }
    },
    series: [
        {
            name: "2019",

            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        },
        {
            name: "2020",
            data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
            name: "2021",
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        },
        {
            name: "2022",
            data: [46, 69, 74, 30, 45, 68, 42, 77, 62, 66, 25, 37]
        },
        {
            name: "2023",
            data: [67, 37, 54, 79, 75, 88, 62, 47, 92, 46, 65, 77]
        }
    ]
};

export default chartData;
