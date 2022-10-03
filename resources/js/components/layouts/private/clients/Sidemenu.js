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
import navClients from "./navClients";

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

    React.useEffect(() => {
        $(".ant-layout-content").addClass("ant-layout-content-addMargin");
    });

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
    } = useAxiosQuery("GET", `api/viewas/client`, "clients_table_viewas");

    let userdata_admin = encryptor.decrypt(localStorage.userdata_admin);
    const handleBackToSuperAdmin = () => {
        viewAsBack(userdata_admin.id, true);
    };

    const viewAsBack = (id, backtoadmin = false) => {
        var newObj = {
            id: id,
            viewas: localStorage.viewas
        };

        mutateviewas(newObj, {
            onSuccess: res => {
                console.log(res);
                localStorage.token = encryptor.encrypt(res.data.token);
                localStorage.userdata = encryptor.encrypt(
                    JSON.parse(res.data.userdata)
                );
                if (backtoadmin) {
                    localStorage.viewas = false;
                    localStorage.removeItem("userdata_admin");
                }

                var url = window.location.origin;
                window.location.href = url;
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    return (
        <>
            <Layout.Sider
                trigger={null}
                collapsible={false}
                collapsed={state.collapsed}
                className="sidemenuDark"
            >
                <div className="client-logo"></div>

                {defaultOptionKey != "" && (
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={[history.location.pathname]}
                        defaultOpenKeys={[defaultOptionKey]}
                    >
                        {navClients.map((nav, key) => {
                            if (nav.visible) {
                                return (
                                    <Menu.Item
                                        key={nav.key}
                                        className={activeRoute(nav.class)}
                                        icon={nav.icon}
                                    >
                                        <Link to={nav.key}>{nav.title}</Link>
                                    </Menu.Item>
                                );
                            }
                        })}
                    </Menu>
                )}

                {localStorage.viewas == "true" && (
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

                        <a
                            style={{ color: "white" }}
                            onClick={e => handleBackToSuperAdmin()}
                        >
                            <small>Back to Admin View</small>
                        </a>
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
                        {navClients.map((nav, key) => {
                            if (nav.visible) {
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
                            }
                        })}
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
