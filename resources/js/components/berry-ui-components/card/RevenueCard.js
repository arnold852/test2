import React from "react";
import PropTypes from "prop-types";
import { forwardRef } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
    Card,
    CardContent,
    Grid,
    Typography,
    useMediaQuery,
    Button
} from "@mui/material";

// =============================|| REVENUE CARD ||============================= //

const RevenueCard = ({
    primary,
    secondary,
    content,
    iconPrimary,
    color,
    isPos
}) => {
    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down("sm"));

    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

    return (
        <Card sx={{ background: color, position: "relative", color: "#000" }}>
            <CardContent>
                <Typography
                    variant="body2"
                    sx={{
                        position: "absolute",
                        right: 13,
                        top: 14,
                        color: "#fff",
                        "&> svg": { width: 100, height: 100, opacity: "0.5" },
                        [theme.breakpoints.down("sm")]: {
                            top: 13,
                            "&> svg": { width: 80, height: 80 }
                        }
                    }}
                >
                    {primaryIcon}
                </Typography>
                <Grid
                    container
                    direction={matchDownXs ? "column" : "row"}
                    spacing={1}
                >
                    <Grid item xs={12}>
                        <Typography variant="h3" color="inherit">
                            {secondary}{" "}
                            <Button
                                style={{ color: isPos ? "#34ebbd" : "#fc033d" }}
                                size="large"
                                variant="text"
                            >
                                {content >= 0 ? (
                                    <ArrowDropUpIcon />
                                ) : (
                                    <ArrowDropDownIcon />
                                )}

                                {content}
                            </Button>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button size="large" variant="text">
                            {/* <ArrowDropDownIcon /> */}
                            {primary} <InfoIcon style={{ marginLeft: "5px" }} />
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

RevenueCard.propTypes = {
    primary: PropTypes.string,
    secondary: PropTypes.string,
    content: PropTypes.string,
    iconPrimary: PropTypes.object,
    color: PropTypes.string
};

export default RevenueCard;
