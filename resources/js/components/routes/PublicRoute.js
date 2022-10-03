import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import PublicLayout from "../layouts/public";
import getUserData from "../providers/getUserData";

const isLoggedIn = localStorage.getItem("token");
const userdata = getUserData();
const PublicRoute = ({ component: Component, ...rest }) => (
    <>
        <Route
            {...rest}
            render={props =>
                !isLoggedIn ? (
                    <PublicLayout>
                        <Component {...props} />
                    </PublicLayout>
                ) : (
                    <>
                        {userdata.role == "Admin" ? (
                            <Redirect to={{ pathname: "/advisors" }} />
                        ) : userdata.init_login == 1 &&
                          userdata.role == "Advisor" ? (
                            <Redirect to={{ pathname: "/welcome" }} />
                        ) : (
                            <Redirect to={{ pathname: "/clients" }} />
                        )}
                    </>
                )
            }
        />
        {/* {console.log(userdata.init_login == 1 ? "true" : "false")} */}
    </>
);

export default PublicRoute;
