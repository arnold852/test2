import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import PrivateAdminsLayout from "../layouts/private/admins/Content";
import PrivateClientsLayout from "../layouts/private/clients/Content";
import getUserData from "../providers/getUserData";
const isLoggedIn = localStorage.getItem("token");
const userdata = getUserData();
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isLoggedIn ? (
                userdata.role == "Admin" ? (
                    <PrivateAdminsLayout>
                        <Component {...props} />
                    </PrivateAdminsLayout>
                ) : (
                    <PrivateClientsLayout>
                        <Component {...props} />
                    </PrivateClientsLayout>
                )
            ) : (
                <Redirect to={{ pathname: "/" }} />
            )
        }
    />
);

export default PrivateRoute;
