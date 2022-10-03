import {
    UserOutlined,
    TableOutlined,
    FolderOpenOutlined,
    GroupOutlined,
    TagOutlined
} from "@ant-design/icons";
import React from "react";
const navAdmins = [
    // {
    //     title: "Dashboard",
    //     key: "/dashboard",
    //     class: "dashboard",
    //     icon: <UserOutlined />
    // },
    {
        title: "Advisors",
        key: "/advisors",
        class: "advisors",
        icon: <UserOutlined />
    },
    {
        title: "Firms",
        key: "/firms",
        class: "firms",
        icon: <GroupOutlined />
    },
    {
        title: "Users",
        key: "/users",
        class: "users",
        icon: <UserOutlined />
    }
    // {
    //     title: "Coupon Codes",
    //     key: "/coupon-code",
    //     class: "coupon",
    //     icon: <TagOutlined />
    // }
];

export default navAdmins;
