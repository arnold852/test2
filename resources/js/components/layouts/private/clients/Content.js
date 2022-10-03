import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Layout } from "antd";

import Header from "./Header";
import Sidemenu from "./Sidemenu";
import Footer from "./Footer";
import IdleTimer from "react-idle-timer";
import getUserData from "../../../providers/getUserData";
export default function Content(props) {
    const history = useHistory();

    const [state, setState] = React.useState({ collapsed: false });

    const toggle = () => setState({ collapsed: !state.collapsed });

    let idleTimer;

    const [timerState, setTimerState] = React.useState({
        timeout: 1000 * 60 * 60,
        userLoggedIn: false,
        isTimedOut: false
    });

    const onAction = e => {
        // console.log("user did something", e);
        setTimerState({ ...timerState, isTimedOut: false });
    };

    const onActive = e => {
        // console.log("user is active", e);
        setTimerState({ ...timerState, isTimedOut: false });
    };

    const onIdle = e => {
        // console.log("user is idle", e);
        const isTimedOut = timerState.isTimedOut;
        if (isTimedOut) {
            // props.history.push("/");
        } else {
            idleTimer.reset();
            // console.log("timeout");
            signOut();
            setTimerState({ ...timerState, isTimedOut: true });
        }
    };

    const signOut = e => {
        if (e) {
            e.preventDefault();
        }
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        localStorage.removeItem("viewas");
        location.href = window.location.origin;
    };

    let userdata = getUserData();

    return (
        <Layout
            style={{
                border:
                    localStorage.viewas == "true" ? "4px solid orange" : "none"
            }}
        >
            {localStorage.viewas == "true" && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: "45%",
                        padding: 10,
                        fontWeight: 900,
                        background: "#ffa50061",
                        color: "black",
                        zIndex: 9999999999999
                    }}
                >
                    Viewing As: {userdata.name}
                </div>
            )}
            <Sidemenu history={history} state={state} />

            <Layout className="site-layout">
                <Header state={state} toggle={toggle} />

                {props.children}

                <Footer />
                <IdleTimer
                    ref={ref => {
                        idleTimer = ref;
                    }}
                    element={document}
                    onActive={onActive}
                    onIdle={onIdle}
                    onAction={onAction}
                    debounce={250}
                    timeout={timerState.timeout}
                />
            </Layout>
        </Layout>
    );
}
