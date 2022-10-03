import React, { useEffect } from "react";

import { useTheme } from "@mui/material/styles";
import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

import {
    FormatListBulleted,
    ListOutlined,
    ReportOutlined,
    ShowChart
} from "@mui/icons-material";
import { Link } from "react-router-dom";
// import LogoSection from "./components/LogoSection";

import logoImage from "../../../assets/img/Propolis-logo-banner-b.png";

// import { openDrawer } from "../../../store/slices/menu";
// import { useDispatch, useSelector } from "store";
import { drawerWidth } from "../../../store/constant";

export default function Sidemenu({
    windowDimensions,
    toogleSidebar,
    setToogleSidebar,
    window
}) {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

    useEffect(() => {
        console.log("toogleSidebar", toogleSidebar);
    }, [toogleSidebar]);

    useEffect(() => {
        console.log("windowDimensions", windowDimensions);
    }, [windowDimensions]);
    // const dispatch = useDispatch();
    // const { drawerOpen } = useSelector(state => state.menu);

    const toggleDrawer = (anchor, open) => event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setToogleSidebar({ ...toogleSidebar, [anchor]: open });
    };

    return (
        <Drawer
            // variant={windowDimensions.width <= 899 ? "persistent" : "temporary"}
            // variant={windowDimensions.width <= 899 ? "persistent" : "permanent"}
            // variant={matchUpMd ? "persistent" : "temporary"}
            variant={matchUpMd ? "persistent" : "temporary"}
            // variant="permanent"
            // sx={{
            //     width: drawerWidth,
            //     flexShrink: 0,
            //     [`& .MuiDrawer-paper`]: {
            //         width: drawerWidth,
            //         boxSizing: "border-box"
            //     }
            // }}
            sx={{
                // width: drawerWidth,
                // flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderRight: "none"
                    // [theme.breakpoints.up("md")]: {
                    //     top: "88px"
                    // }
                }
            }}
            anchor={"left"}
            open={toogleSidebar["left"]}
            onClose={toggleDrawer("left", false)}
            className="main-sidebar"
        >
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
                    <img
                        src={logoImage}
                        style={{
                            marginTop: "10px",
                            marginRight: "12px",
                            marginBottom: "-30px"
                        }}
                    />
                </Box>
            </Box>
            <br />
            <Toolbar
                sx={{
                    display: { xs: "none", md: "block" }
                }}
            />
            <Box sx={{ overflow: "auto" }}>
                <List style={{ paddingLeft: "22px", paddingRight: "22px" }}>
                    {/* {["Guesty", "User Management"].map((text, index) => (
                    ))} */}
                    <ListItem key={"Reservations"} disablePadding>
                        <Link
                            to="/"
                            style={{ width: "100%", color: "#757575" }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <FormatListBulleted />
                                </ListItemIcon>
                                <ListItemText primary={"Reservations"} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key={"Reports"} disablePadding>
                        <Link
                            to="/reports"
                            style={{ width: "100%", color: "#757575" }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <FormatListBulleted />
                                </ListItemIcon>
                                <ListItemText primary={"Reports"} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key={"Users"} disablePadding>
                        <Link
                            to="/users"
                            style={{ width: "100%", color: "#757575" }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <GroupIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Users"} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key={"Analytics"} disablePadding>
                        <Link
                            to="/analytics"
                            style={{ width: "100%", color: "#757575" }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <ShowChart />
                                </ListItemIcon>
                                <ListItemText primary={"Analytics"} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key={"Properties"} disablePadding>
                        <Link
                            to="/properties"
                            style={{ width: "100%", color: "#757575" }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <FormatListBulleted />
                                </ListItemIcon>
                                <ListItemText primary={"Properties"} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
