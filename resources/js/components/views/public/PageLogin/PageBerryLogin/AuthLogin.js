import React, { useState, useRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik, replace } from "formik";

// project imports
// import useScriptRef from "usescript-hook";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useHistory } from "react-router-dom";
import useAxiosQuery from "../../../../providers/useAxiosQuery";

// import { useNavigate } from "react-router";
// ============================|| FIREBASE - LOGIN ||============================ //
const key = "TheMoneyCouple@2021";
const encryptor = require("simple-encryptor")(key);
const FirebaseLogin = ({ ...others }) => {
    const history = useHistory();
    const theme = useTheme();
    const scriptedRef = useRef();
    const [checked, setChecked] = useState(true);

    const googleHandler = async () => {
        console.error("Login");
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const {
        mutate: mutateLogin,
        isLoading: isLoadingButtonLogin
    } = useAxiosQuery("POST", "api/login");

    return (
        <>
            <Grid
                container
                direction="column"
                justifyContent="center"
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">
                            Sign in with Email address
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: "",
                    password: ""
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email("Must be a valid email")
                        .max(255)
                        .required("Email is required"),
                    password: Yup.string()
                        .max(255)
                        .required("Password is required")
                })}
                onSubmit={values => {
                    console.log("values", values);
                    mutateLogin(values, {
                        onSuccess: res => {
                            if (res.token) {
                                console.log(encryptor.encrypt(res.token));
                                localStorage.token = encryptor.encrypt(
                                    res.token
                                );
                                localStorage.userdata = encryptor.encrypt(
                                    res.data
                                );
                                localStorage.setItem(
                                    "welcome_back_message",
                                    true
                                );
                                // location.reload();
                                window.location.href = "/";
                            } else {
                                setErrorMessage(
                                    "Username or Password is Invalid"
                                );
                            }
                        },
                        onError: err => {
                            setErrorMessage(err.response.data.error);
                        }
                    });
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-email-login">
                                Email Address
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText
                                    error
                                    id="standard-weight-helper-text-email-login"
                                >
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <br />
                        <br />

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? "text" : "password"}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? (
                                                <Visibility />
                                            ) : (
                                                <VisibilityOff />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText
                                    error
                                    id="standard-weight-helper-text-password-login"
                                >
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <Button
                                // disableElevation
                                // disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                // color="secondary"
                            >
                                Sign in
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
