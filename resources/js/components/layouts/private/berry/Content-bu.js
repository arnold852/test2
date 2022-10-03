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

import useAxiosQuery from "../../../providers/useAxiosQuery";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export default function Content(props) {
    const [toogleSidebar, setToogleSidebar] = useState(true);

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
            setToogleSidebar(false);
        } else {
            setToogleSidebar(true);
        }
        console.log("windowDimensions", windowDimensions.width);
    }, [windowDimensions]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* header  */}
            <Header
                toogleSidebar={toogleSidebar}
                setToogleSidebar={setToogleSidebar}
            />

            {toogleSidebar === true && <Sidemenu />}

            <Box
                className="content"
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Toolbar />
                <Box
                    className="body-content"
                    sx={{ flexGrow: 1 }}
                    style={{ paddingTop: "10px" }}
                >
                    {props.children}
                </Box>
            </Box>
        </Box>
    );
    // return <>{props.children}</>;
}
