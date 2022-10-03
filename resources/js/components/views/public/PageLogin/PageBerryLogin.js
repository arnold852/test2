import React, { useState } from "react";
import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// projects imports
import AuthWrapper1 from "../../../berry-providers/AuthWrapper1";
import AuthCardWrapper from "../../../berry-providers/AuthCardWrapper";
import Logo from "../../../berry-ui-components/Logo";
import AuthLogin from "./PageBerryLogin/AuthLogin";
import AuthFooter from "../../../berry-ui-components/card/AuthFooter";
import imageLogo from "../../../assets/img/Propolis-logo-banner-b.png";

export default function PageBerryLogin() {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <AuthWrapper1>
            <Grid
                container
                direction="column"
                justifyContent="flex-end"
                sx={{ minHeight: "100vh" }}
                className="berry-login"
            >
                <Grid item xs={12}>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{ minHeight: "calc(100vh - 68px)" }}
                    >
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Grid item sx={{ mb: 3 }}>
                                        {/* <Link to="#"><Logo /></Link> */}
                                        <img
                                            src={imageLogo}
                                            style={{ width: "200px" }}
                                        ></img>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AuthLogin />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <br />
                                    <br />
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid> */}
            </Grid>
        </AuthWrapper1>
    );
}
