import { border } from "@mui/system";

const chartData = {
    height: 400,
    type: "line",
    options: {
        chart: {
            id: "listing-level-metrics-chart",

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
            width: 0
        },

        markers: {
            size: 10,
            hover: {
                sizeOffset: 3
            }
        },
        legend: {
            show: false
        },

        // points: [
        //     {
        //         x: new Date("01 Dec 2017").getTime(),
        //         y: 8607.55,
        //         marker: {
        //             size: 8
        //         },
        //         label: {
        //             borderColor: "#FF4560",
        //             text: "Point Annotation"
        //         }
        //     }
        // ],

        grid: {
            borderColor: "#f1f1f1",
            // borderWidth: 4,
            // display: true,
            drawborder: true
        },

        scales: {
            y: {
                min: 0,
                max: 100,
                stepSize: 20,
                title: {
                    text: "Listing Occupancy"
                },
                labels: {
                    show: true
                }
            },
            x: {
                min: 0,
                max: 100,
                stepSize: 20,
                title: {
                    text: "Market Occupancy"
                }
            }
        },

        // points: [
        //     {
        //         x: "Feb",
        //         y: 50,
        //         marker: {
        //             size: 8
        //         },
        //         label: {
        //             borderColor: "#FF4560",
        //             text: "Point Annotation"
        //         }
        //     }
        // ],

        yaxis: {
            title: {
                text: "Listing Occupancy"
            },
            labels: {
                show: true
            }
        },

        xaxis: {
            categories: [0, 20, 40, 60, 80],
            title: {
                text: "Market Occupancy"
            },
            labels: {
                show: true
            }
        }
    },
    series: [
        {
            name: "Session Duration",
            data: ["", "", 45, "", ""]
        },
        {
            data: ["", 50, "", "", ""]
        },
        {
            data: ["", "", 64, "", ""]
        },
        {
            data: ["", "", 80, "", ""]
        },
        {
            data: ["", "", 70, "", ""]
        },
        {
            data: ["", "", 64, "", ""]
        }
    ]
};

export default chartData;
