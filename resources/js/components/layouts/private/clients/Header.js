import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, message } from "antd";

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import * as clipboard from "clipboard-polyfill/text";
import getUserData from "../../../providers/getUserData";
import useAxiosQuery from "../../../providers/useAxiosQuery";
import DateCountdown from "react-date-countdown-timer";
import moment, { duration } from "moment";
export default function Header({ state, toggle }) {
    const handleLogout = e => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("viewas");
        location.href = window.location.origin;
    };
    let userdata = getUserData();
    const { data: dataClient } = useAxiosQuery(
        "GET",
        `api/client/${userdata.id}`,
        "client_data",
        res => {
            // console.log("client_data", res);
        }
    );

    React.useEffect(() => {
        let welcome = JSON.parse(localStorage.getItem("welcome_back_message"));
        if (welcome == true) {
            message.info({
                content: "Welcome back, " + userdata.name,
                className: "welcome-back-header",
                style: {
                    fontSize: "16px"
                }
            });

            localStorage.setItem("welcome_back_message", false);
        }
    }, []);

    return (
        <Layout.Header
            className="site-layout-background"
            style={{ padding: 0 }}
        >
            {/* {React.createElement(
                state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                    className: "trigger float-left",
                    onClick: toggle
                }
            )} */}

            <a
                className="float-left mobileHeader"
                style={{ marginLeft: 15 }}
                onClick={e =>
                    clipboard
                        .writeText(
                            `${window.location.origin}/cobranded/${dataClient &&
                                dataClient.data.short_name}`
                        )
                        .then(
                            function() {
                                message.success(
                                    "Link succesfully copied to clipboard!"
                                );
                            },
                            function() {
                                message.success("error!");
                            }
                        )
                }
            >
                {dataClient && dataClient.data.short_name ? (
                    <>
                        {" "}
                        <span style={{ color: "black" }}>
                            Give out this link to your branded assessment:
                        </span>{" "}
                        {window.location.origin}/cobranded/
                        {dataClient.data.short_name}
                    </>
                ) : (
                    ""
                )}
            </a>

            <Menu>
                {/* {dataClient && console.log("datas", dataClient)} */}

                <div style={{ marginLeft: 25 }} className="float-left ">
                    {dataClient && dataClient.subscription_type == "Demo" && (
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: 5

                                // position: "absolute",
                                // right: "170px",
                                // top: "-5px"
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    lineHeight: 0,
                                    position: "relative",
                                    top: "11px"
                                }}
                            >
                                Demo Expires in{" "}
                            </p>
                            <DateCountdown
                                dateTo={moment(dataClient.date_created).format(
                                    "LLL"
                                )}
                                dateFrom={moment(dataClient.date_now).format(
                                    "LLL"
                                )}
                                mostSignificantFigure={"day"}
                                numberOfFigures={3}
                                noAnimate={true}
                            />

                            {console.log(
                                "created",
                                moment(dataClient.date_created).format("LLL")
                            )}
                            {console.log(
                                "datenowtz",
                                moment(dataClient.date_now).format("LLL")
                            )}
                        </div>
                    )}
                </div>
                <Menu.Item
                    icon={<LogoutOutlined />}
                    key="/logout"
                    className="logoutMobile"
                >
                    <a href="#" onClick={handleLogout}>
                        Logout
                    </a>
                </Menu.Item>
            </Menu>
        </Layout.Header>
    );
}
