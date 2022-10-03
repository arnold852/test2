import React, { useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import LogoSection from "./components/LogoSection";
import SearchSection from "./components/SearchSection";

// assets
import { IconMenu2 } from "@tabler/icons";
import Grid from "@mui/material/Grid";
import { Button, Image, Space } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import logoImage from "../../../assets/img/Propolis-logo-banner-b.png";
import getUserData from "../../../providers/getUserData";
import { Link, useHistory } from "react-router-dom";

import Avatars from "../../../berry-ui-components/extended/Avatar";
import useAxiosQuery from "../../../providers/useAxiosQuery";

export default function Header(props) {
    const history = useHistory();
    const userdata = getUserData();
    const { toogleSidebar, setToogleSidebar } = props;
    const theme = useTheme();

    const handleLeftDrawerToggle = () => {
        setToogleSidebar({ left: !toogleSidebar.left });
    };

    const handleLogout = e => {
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        location.href = window.location.origin;
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = e => {
        setAnchorEl(e.currentTarget);
        console.log(e);
        $(".profile-btn").addClass("profile-btn-active");
    };

    const handleClose = () => {
        $(".profile-btn").removeClass("profile-btn-active");
        setAnchorEl(null);
    };

    const [fileList, setFileList] = useState([]);
    const [name, setName] = useState("");
    // useEffect(() => {
    //     if (userdata) {
    //         let image = userdata.upload
    //             ? window.location.origin + "/" + userdata.upload
    //             : null;
    //         setFileList(image);
    //     }
    // }, []);

    const {} = useAxiosQuery(
        "GET",
        `api/users/${userdata.id}`,
        "userdata",
        res => {
            if (res.success) {
                console.log("header_result", res.data.upload);
                setName(res.data.name);
                if (res.data.upload) {
                    let image = res.data.upload
                        ? window.location.origin + "/" + res.data.upload
                        : null;
                    setFileList(image);
                }
            }
        }
    );

    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
            style={{ paddingRight: "0px !important" }}
            className="main-header"
        >
            <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                    {/* <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            [theme.breakpoints.down("md")]: {
                                width: "auto"
                            }
                        }}
                    > */}
                    <Space>
                        <Box
                            component="span"
                            sx={{
                                display: { xs: "none", md: "block" },
                                flexGrow: 1
                            }}
                        >
                            {/* <LogoSection /> */}
                            <img
                                src={logoImage}
                                style={{
                                    marginTop: "-3px",
                                    marginRight: "32px"
                                }}
                            />
                        </Box>

                        <ButtonBase
                            className="toogle"
                            sx={{
                                borderRadius: "12px",
                                overflow: "hidden"
                            }}
                        >
                            <Avatar
                                variant="rounded"
                                onClick={handleLeftDrawerToggle}
                                color="inherit"
                            >
                                <IconMenu2 stroke={1.5} size="1.3rem" />
                            </Avatar>
                        </ButtonBase>
                    </Space>
                    {/* </Box> */}
                </Grid>

                <Grid item xs={6} md={6}>
                    <Button
                        shape="round"
                        size="large"
                        className="profile-btn"
                        style={{
                            float: "right",
                            paddingTop: "7px",
                            paddingLeft: "9px",
                            paddingRight: "10px",
                            height: "48px"
                        }}
                        onClick={e => handleClick(e)}
                    >
                        <Space className="profile-toogle">
                            {/* <Image
                                className="profile-icon"
                                preview={false}
                                src="https://berrydashboard.io/static/media/user-round.13b5a31b.svg"
                            /> */}
                            <Avatars
                                alt="User 1"
                                className="profile-icon"
                                src={fileList}
                                sx={
                                    {
                                        // marginTop: "-3px"
                                        // marginRight: "12px",
                                        // cursor: "pointer"
                                    }
                                }
                                // onClick={e => handleOpenUpload()}
                            />
                            <SettingOutlined
                                style={{ fontSize: "18px", marginTop: "10px" }}
                            />
                        </Space>
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter:
                                    "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1
                                },
                                "&:before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0
                                }
                            }
                        }}
                        transformOrigin={{
                            horizontal: "right",
                            vertical: "top"
                        }}
                        anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom"
                        }}
                    >
                        <div
                            style={{
                                width: "250px",
                                padding: "12px"
                            }}
                            disabled={true}
                        >
                            <Space className="profile-toogle">
                                {/* <Image
                                    className="profile-icon"
                                    preview={false}
                                    src="https://berrydashboard.io/static/media/user-round.13b5a31b.svg"
                                /> */}
                                <Avatars
                                    alt="User 1"
                                    className="profile-icon"
                                    src={fileList}
                                    // onClick={e => handleOpenUpload()}
                                    style={{
                                        marginLeft: "4px",
                                        marginTop: "-6px"
                                    }}
                                />
                                <p style={{ marginTop: "7px" }}>{name}</p>
                            </Space>
                        </div>

                        <Divider />
                        <MenuItem
                            onClick={e =>
                                history.push(`/users/edit/${userdata.id}`)
                            }
                        >
                            {/* <Link
                                to={`/users/edit/${userdata.id}`}
                                style={{ color: "#212121" }}
                            > */}
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Account Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>

            {/* <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Clipped drawer
                </Typography>
            </Toolbar> */}
        </AppBar>
    );
}
