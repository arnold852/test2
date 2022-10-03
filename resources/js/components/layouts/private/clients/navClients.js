import {
    FolderOpenOutlined,
    GroupOutlined,
    PhoneOutlined,
    SettingOutlined,
    UserOutlined
} from "@ant-design/icons";
import React from "react";
import getUserData from "../../../providers/getUserData";
const userdata = getUserData();
const navClients = [
    // {
    //     title: "Dashboard",
    //     key: "/dashboard",
    //     class: "dashboard",
    //     icon: <UserOutlined />
    // },
    {
        title: "Clients",
        key: "/clients",
        class: "clients",
        visible: true,
        icon: <UserOutlined />
    },
    {
        title: "Firm",
        key: "/firm",
        visible: userdata.firm ? true : false,
        icon: <GroupOutlined />
    },
    {
        title: "Settings",
        key: "/settings",
        class: "settings",
        visible: true,
        icon: <SettingOutlined />
    },
    {
        title: "Resources",
        key: "/resources",
        class: "resources",
        visible: true,
        icon: <FolderOpenOutlined />
    },
    {
        title: "Contact",
        key: "/contact",
        class: "contact",
        visible: true,
        icon: <PhoneOutlined />
    }
];

export default navClients;
