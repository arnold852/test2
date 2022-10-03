import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined
} from "@ant-design/icons";

export default function Header({ state, toggle }) {
    const handleLogout = e => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("viewas");
        location.href = window.location.origin;
    };

    return (
        <Layout.Header
            className="site-layout-background "
            style={{ padding: 0 }}
        >
            {/* {
                    React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger float-left',
                        onClick: toggle
                    })
                } */}
            <div className="mobileHeader"></div>
            <Menu>
                <Menu.Item icon={<LogoutOutlined />} key="/logout">
                    <a href="#" onClick={handleLogout}>
                        Logout
                    </a>
                </Menu.Item>
            </Menu>
        </Layout.Header>
    );
}
