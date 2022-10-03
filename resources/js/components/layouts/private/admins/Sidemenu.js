import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";

import {
    UserOutlined,
    BookOutlined,
    BuildOutlined,
    TeamOutlined,
    MenuOutlined,
    CloseOutlined
} from "@ant-design/icons";
// import navAdmins from "./NavAdmins";
import { Select } from "antd";

import useAxiosQuery from "../../../providers/useAxiosQuery";
const key = "TheMoneyCouple@2021";
const encryptor = require("simple-encryptor")(key);
export default function Sidemenu({ history, state }) {
    const activeRoute = routeName => {
        let pathname = history.location.pathname.split("/")[1];
        return pathname === routeName ? "ant-menu-item-selected" : "";
    };

    const activeSubRoute = routeName => {
        return history.location.pathname === routeName
            ? "ant-menu-item-selected"
            : "";
    };

    const [defaultOptionKey, setDefaultOptionKey] = useState("");

    useEffect(() => {
        let pathname = history.location.pathname;
        pathname = pathname.split("/");
        pathname = "/" + pathname[1];
        setDefaultOptionKey(pathname);
    }, []);

    const openSider = () => {
        $(".mobileMenu").removeClass("hide");
    };
    const closeSider = () => {
        $(".mobileMenu").addClass("hide");
    };

    const { Option } = Select;

    const { mutate: mutateviewas, isLoading: isLoadingviewas } = useAxiosQuery(
        "POST",
        "api/generate/token/user",
        "clients_table_viewas"
    );

    function onChange(value) {
        var newObj = {
            id: value,
            viewas: localStorage.viewas
        };
        mutateviewas(newObj, {
            onSuccess: res => {
                console.log(res);
                localStorage.token = encryptor.encrypt(res.data.token);
                localStorage.userdata_admin = localStorage.userdata;
                localStorage.userdata = encryptor.encrypt(
                    JSON.parse(res.data.userdata)
                );
                localStorage.viewas = true;
                // // window.location.reload();
                var url = window.location.origin;
                window.location.href = url;
            },
            onError: err => {
                console.log(err);
            }
        });
    }

    // React.useEffect(() => {
    //     refetchClients();
    //     return () => {};
    // }, []);

    // for table
    const {
        data: dataClients,
        isLoading: isLoadingTblClients,
        refetch: refetchClients,
        isFetching: isFetchingTblClients
    } = useAxiosQuery(
        "GET",
        `api/viewas/client`,
        "clients_table_viewas",
        res => {
            console.log("clients_table_viewas", res);
        }
    );

    return (
        <>
            <Layout.Sider
                trigger={null}
                collapsible={false}
                collapsed={state.collapsed}
                className="sidemenuDark"
                // style={{ background: "#B8D34A" }}
            >
                <div className="client-logo"></div>
                {defaultOptionKey != "" && (
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={[history.location.pathname]}
                        defaultOpenKeys={[defaultOptionKey]}
                    >
                        {/* {navAdmins.map((nav, key) => {
                            return (
                                <Menu.Item
                                    key={nav.key}
                                    className={activeRoute(nav.class)}
                                    icon={nav.icon}
                                >
                                    <Link to={nav.key}>{nav.title}</Link>
                                </Menu.Item>
                            );
                        })} */}
                    </Menu>
                )}

                {dataClients && (
                    <div
                        style={{
                            marginTop: 10,
                            textAlign: "center"
                        }}
                    >
                        <small
                            style={{
                                display: "block",
                                marginBottom: 5,
                                color: "white",
                                marginRight: "20px"
                            }}
                        >
                            View As
                        </small>

                        <Select
                            showSearch
                            style={{ width: "90%" }}
                            placeholder="Select an Advisor"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {dataClients &&
                                dataClients.data.map(option => {
                                    return (
                                        <>
                                            <Option value={option.id}>
                                                {option.name}
                                            </Option>
                                        </>
                                    );
                                })}
                        </Select>
                    </div>
                )}
            </Layout.Sider>
            <Layout.Sider
                trigger={null}
                collapsible={false}
                collapsed={state.collapsed}
                className="mobileMenu hide"
            >
                <div className="closeMenuMobile" onClick={() => closeSider()}>
                    <CloseOutlined />
                </div>{" "}
                <div className="client-logo"></div>
                {defaultOptionKey != "" && (
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={[history.location.pathname]}
                        defaultOpenKeys={[defaultOptionKey]}
                    >
                        {/* {navAdmins.map((nav, key) => {
                            return (
                                <Menu.Item
                                    key={nav.key}
                                    className={activeRoute(nav.class)}
                                    icon={nav.icon}
                                    onClick={() => closeSider()}
                                >
                                    <Link to={nav.key}>{nav.title}</Link>
                                </Menu.Item>
                            );
                        })} */}
                    </Menu>
                )}
            </Layout.Sider>

            <div className="menuHamburger" onClick={() => openSider()}>
                {" "}
                <MenuOutlined />
            </div>
        </>
    );
}
