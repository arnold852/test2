import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Layout } from "antd";

import Header from "./Header";
import Sidemenu from "./Sidemenu";
import Footer from "./Footer";
import FirebaseNotifs from "./FirebaseNotifs";
import IdleTimer from "react-idle-timer";
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
        localStorage.viewas = false;
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        localStorage.removeItem("viewas");
        location.href = window.location.origin;
    };

    return (
        <Layout>
            <FirebaseNotifs />
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
