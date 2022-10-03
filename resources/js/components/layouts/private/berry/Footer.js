import React from "react";
import { Layout } from "antd";
import moment from "moment";

export default function Footer() {
    return (
        <div style={{ textAlign: "center", color: "#d5d5d5" }}>
            <small>Pro Polis ©{moment().format("YYYY")} v2.1</small>
        </div>
    );
}
