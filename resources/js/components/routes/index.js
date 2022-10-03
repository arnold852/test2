import React from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// import config from "config";

import "antd/dist/antd.css";
import "../assets/css/custom.css";
import "../assets/css/custom-mobile.css";
import "../assets/scss/style.css";

import getUserData from "../providers/getUserData";

import PageNotFound from "../views/PageNotFound/PageNotFound";

/** end private */

import PrivateBerryRoute from "./PrivateBerryRoute";
import PageReports from "../views/private/admins/PageReports/PageReports";

const queryClient = new QueryClient();
const userdata = getUserData();
export default function Routes() {
    // console.log(userdata.role);
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Switch>
                    <PrivateBerryRoute exact path="/" component={PageReports} />

                    <Route exact path="/not-found" component={PageNotFound} />
                    <Redirect to="/not-found" />
                </Switch>
            </Router>
        </QueryClientProvider>
    );
}
