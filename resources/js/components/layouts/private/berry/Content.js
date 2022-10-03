import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// component imports
import Header from "./Header";
import Sidemenu from "./Sidemenu";
import SidemenuMobile from "./SidemenuMobile";

import { drawerWidth } from "../../../store/constant";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Footer from "./Footer";

function getWindowDimensions() {
    const { innerWidth: width } = window;
    return {
        width
    };
}

export default function Content(props) {
    const [toogleSidebar, setToogleSidebar] = useState({
        left: true
    });

    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [windowDimensions]);

    useEffect(() => {
        if (windowDimensions.width <= 899) {
            setToogleSidebar({ left: false });
        } else {
            setToogleSidebar({ left: true });
        }
        console.log("windowDimensions", windowDimensions.width);
    }, [windowDimensions]);

    return (
        <Box sx={{ display: "flex" }}>
            <Box className="content" component="main">
                <Toolbar />
                <Box className="body-content" sx={{ flexGrow: 1 }}>
                    {props.children}
                </Box>
            </Box>
        </Box>
    );
    // return <>{props.children}</>;
}
