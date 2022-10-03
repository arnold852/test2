import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateClientsLayout from "../layouts/private/berry/Content";
import getUserData from "../providers/getUserData";
const PrivateBerryRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            <PrivateClientsLayout>
                <Component {...props} />
            </PrivateClientsLayout>
        )}
    />
);

export default PrivateBerryRoute;
