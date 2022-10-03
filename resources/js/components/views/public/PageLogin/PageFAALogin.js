import React from "react";

import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    Alert,
    Divider,
    Row,
    Col,
    Modal,
    message,
    notification
} from "antd";
import { UserOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";

import ally_image from "../../../assets/img/ally_image.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { DragDropContext } from "react-beautiful-dnd";

const key = "TheMoneyCouple@2021";
const encryptor = require("simple-encryptor")(key);
export default function PageFAALogin() {
    const [errorMessage, setErrorMessage] = React.useState();
    const [showUpgradeLink, setShowUpgradeLink] = React.useState(false);
    const [showUpgradeYearlyLink, setShowUpgradeYearlyLink] = React.useState(
        false
    );
    const [showUpgradeMonthlyLink, setShowUpgradeMonthlyLink] = React.useState(
        false
    );

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const {
        mutate: mutateLogin,
        isLoading: isLoadingButtonLogin
    } = useAxiosQuery("POST", "api/login");

    React.useEffect(() => {
        if (urlParams.get("token")) {
            let token = urlParams.get("token");
            let userdata = JSON.parse(urlParams.get("userdata"));
            userdata.email = userdata.email.replace(" ", "+");

            localStorage.token = encryptor.encrypt(token);
            localStorage.userdata = encryptor.encrypt(userdata);
            location.href = `${window.location.origin}/welcome`;
        }
        return () => {};
    }, []);

    const onFinish = values => {
        setErrorMessage(undefined);
        let data = { email: values.email, password: values.password };
        // console.log(values.password)
        mutateLogin(data, {
            onSuccess: res => {
                if (res.token) {
                    localStorage.token = encryptor.encrypt(res.token);
                    localStorage.userdata = encryptor.encrypt(res.data);
                    localStorage.setItem("welcome_back_message", true);
                    location.reload();
                } else {
                    setErrorMessage("Username or Password is Invalid");
                }
            },
            onError: err => {
                // if (err.response.data.error == "Demo Subscription Expired") {
                //     setShowUpgradeLink(true);
                // }
                if (err.response.data.error == "Yearly Subscription Expired") {
                    setErrorMessage(err.response.data.error);
                    countDownModalYearly();
                }
                if (err.response.data.error == "Monthly Subscription Expired") {
                    setErrorMessage(err.response.data.error);
                    countDownModalDemo();
                }
                if (err.response.data.error == "Demo Subscription Expired") {
                    setErrorMessage(err.response.data.error);
                    countDownModalDemo();
                    setShowUpgradeLink(true);
                }

                if (
                    err.response.data.error != "Demo Subscription Expired" &&
                    err.response.data.error != "Monthly Subscription Expired" &&
                    err.response.data.error != "Yearly Subscription Expired"
                ) {
                    setErrorMessage(err.response.data.error);
                    countDownModal(err.response.data.error);
                }
            }
        });
    };

    function countDownModalYearly() {
        const modal = Modal.confirm({
            content: (
                <div>
                    <CloseOutlined
                        className="closeModal"
                        onClick={() => {
                            modal.destroy();
                        }}
                    />
                    <YearlyModal />
                </div>
            ),
            className: "modalDemoExpired"
        });
    }

    function countDownModalDemo() {
        const modal = Modal.confirm({
            content: (
                <div>
                    <CloseOutlined
                        className="closeModal"
                        onClick={() => {
                            modal.destroy();
                        }}
                    />
                    <MonthyModal />
                </div>
            ),
            className: "modalDemoExpired"
        });
    }

    function countDownModal(message) {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: message
            // content: `This modal will be destroyed after ${secondsToGo} second.`
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            // modal.update({
            //     content: `This modal will be destroyed after ${secondsToGo} second.`
            // });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
        }, secondsToGo * 1000);
    }

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    return (
        <Layout className="login-layout">
            <Row style={{ background: "white" }}>
                <Col xs={24} md={24} className="text-center">
                    <img
                        alt="Company logo"
                        src={ally_image}
                        style={{ width: 384 }}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={7}></Col>
                <Col xs={24} md={10} style={{ padding: 10 }}>
                    <Card>
                        <Row>
                            <Col xs={24} md={24}>
                                <div className="text-center">
                                    {urlParams.get("inf_field_Email") && (
                                        <>
                                            <Alert
                                                // message="Thank you for signing up for Financial Advisor Ally, check your email for your username and password"
                                                message="Check your email to verify your account."
                                                type="warning"
                                            />
                                            <br />
                                        </>
                                    )}
                                </div>
                                <Card.Meta
                                    title={
                                        <Title level={3} style={{ margin: 0 }}>
                                            Login
                                        </Title>
                                    }
                                    className="m-b-md"
                                />
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        email: urlParams.get("un")
                                            ? urlParams
                                                  .get("un")
                                                  .replace(" ", "+")
                                            : urlParams.get("inf_field_Email")
                                            ? urlParams
                                                  .get("inf_field_Email")
                                                  .replace(" ", "+")
                                            : localStorage.email,
                                        password: localStorage.password
                                    }}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Username!"
                                            }
                                        ]}
                                        placeholder="Username"
                                    >
                                        <Input
                                            placeholder="Email"
                                            prefix={
                                                <UserOutlined className="site-form-item-icon" />
                                            }
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!"
                                            }
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Password"
                                        />
                                    </Form.Item>

                                    {errorMessage && (
                                        <Alert
                                            style={{ marginBottom: 10 }}
                                            className="mt-10"
                                            type="error"
                                            message={
                                                showUpgradeLink ? (
                                                    <>
                                                        {" "}
                                                        Your demo trial period
                                                        has expired. To continue
                                                        using your cobranded
                                                        assessments and all
                                                        other features,{" "}
                                                        <a href="  https://if169.infusionsoft.app/app/orderForms/Financial-Advisor-Ally?cookieUUID=5afca7a9-baa2-428c-a927-018fb719c68f">
                                                            {" "}
                                                            please upgrade{" "}
                                                        </a>{" "}
                                                    </>
                                                ) : (
                                                    errorMessage
                                                )
                                            }
                                        />
                                    )}

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoadingButtonLogin}
                                            className="login-form-button tmcButton "
                                        >
                                            SUBMIT
                                        </Button>

                                        <div className="forgot">
                                            <Button
                                                type="link"
                                                htmlType="button"
                                                className="login-form-button"
                                                size="small"
                                                style={{ fontSize: "16px" }}
                                                onClick={() => {
                                                    window.location.href =
                                                        window.location.origin +
                                                        "/forgotpassword";
                                                }}
                                            >
                                                Forgot your password?
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </Col>
                            {/* <Col xs={24} md={12}>
                                <div className="text-center">
                                    <Title level={4} className="text-center">
                                        Haven't taken the Assessment?
                                    </Title>
                                    <img
                                        src={reportGraphicLogo}
                                        style={{ width: 195, margin: "auto" }}
                                    />
                                    <br />
                                    <Text>
                                        If you haven't yet taken the Money
                                        Personality Assessment, please click to
                                    </Text>
                                    <Button
                                        type="primary"
                                        className="tmcButton mobiletake"
                                        style={{
                                            width: "355px",
                                            marginTop: "10px"
                                        }}
                                        block
                                        onClick={() => showModal()}
                                    >
                                        TAKE THE MONEY PERSONALITY ASSESSMENT
                                    </Button>
                                </div>
                            </Col> */}
                        </Row>
                    </Card>
                    <Divider />
                    <div className="text-center">
                        © {moment().format("YYYY")} Financial Advisor Ally.{" "}
                        <br />
                        All Rights Reserved. <br /> <a href="#">
                            Disclaimer
                        </a> · <a href="#">Contact</a> ·{" "}
                        <a href="#">Privacy Policy</a>
                    </div>
                </Col>
                <Col xs={24} md={3}></Col>
            </Row>
        </Layout>
    );
}

export function MonthyModal() {
    return (
        <>
            <div
                style={{
                    background: "rgb(137,156,56)",
                    background:
                        "linear-gradient(280deg, rgba(137,156,56,1) 0%, rgba(186,213,74,1) 100%, rgba(118,16,176,1) 189%)",
                    height: "95vh"
                }}
                className="containermonth"
            >
                <div
                    style={{
                        position: "absolute",
                        marginTop: "5%"
                    }}
                    className="imageBell"
                >
                    <img
                        alt="Company logo"
                        src={window.location.origin + "/images/bell.png"}
                        style={{ width: "100%", opacity: "0.3" }}
                    />
                </div>
                <Row>
                    <Col xs={24} md={24}>
                        <div
                            style={{
                                maxWidth: "800px",
                                margin: "auto",
                                textAlign: "center"
                            }}
                        >
                            <p style={{ marginTop: "60px" }}>
                                <span
                                    style={{
                                        color: "white",
                                        fontSize: "70px",
                                        fontWeight: "800"
                                    }}
                                    className="fontSizeMonthTitle"
                                >
                                    YOUR DEMO IS OVER,
                                </span>{" "}
                                <br></br>
                                <span
                                    style={{
                                        color: "white",
                                        fontSize: "25px"
                                    }}
                                >
                                    {" "}
                                    BUT THAT DOESN'T MEAN YOUR RELATIONSHIP WITH{" "}
                                    <br></br>
                                    FINANCIAL ADVISOR ALLY HAS TO BE.{" "}
                                </span>
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        <div
                            style={{
                                maxWidth: "1000px",
                                margin: "auto"
                            }}
                        >
                            <Row>
                                <Col
                                    xs={24}
                                    md={8}
                                    style={{ padding: 30 }}
                                    className="monthColContainer"
                                >
                                    <div className="divFaaProduct">
                                        <div className="divFaaProductAmount">
                                            <span className="divFaaProductAmountdollar">
                                                $
                                            </span>{" "}
                                            49{" "}
                                            <span className="divFaaProductAmountspan">
                                                /MO
                                            </span>
                                        </div>
                                        <div className="divFaaProductDescription">
                                            <b>
                                                UNLIMITED CLIENT ASSESSMENT
                                                ACCESS TO PORTAL AND DASHBOARD
                                                BEHAVORIAl FINANCE TOOLS
                                            </b>
                                            <br></br>
                                            +MORE
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#bdd549",
                                                    borderRadius: "20px",
                                                    color: "white",
                                                    width: "80%"
                                                }}
                                                onClick={() => {
                                                    window.location.href =
                                                        window.location.origin +
                                                        "/faa-checkout?type=monthly";
                                                }}
                                            >
                                                PURCHASE
                                            </Button>
                                        </div>
                                        <div className="divFaaProductFooter">
                                            IDEAL FOR IDIVIDUAL ADVSORS OR SMALL
                                            FIRMS
                                        </div>
                                    </div>
                                </Col>
                                <Col
                                    xs={24}
                                    md={8}
                                    style={{ padding: 30 }}
                                    className="monthColContainer"
                                >
                                    <div className="divFaaProduct">
                                        <div className="divFaaProductFree">
                                            {" "}
                                            2 MONTHS FREE
                                        </div>
                                        <div className="divFaaProductAmount">
                                            <span className="divFaaProductAmountdollar">
                                                $
                                            </span>{" "}
                                            499{" "}
                                            <span className="divFaaProductAmountspan">
                                                /YR
                                            </span>
                                        </div>
                                        <div className="divFaaProductDescription">
                                            <b>
                                                UNLIMITED CLIENT ASSESSMENT
                                                ACCESS TO PORTAL AND DASHBOARD
                                                BEHAVORIAl FINANCE TOOLS
                                            </b>
                                            <br></br>
                                            +MORE
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#bdd549",
                                                    borderRadius: "20px",
                                                    color: "white",
                                                    width: "80%"
                                                }}
                                                onClick={() => {
                                                    window.location.href =
                                                        window.location.origin +
                                                        "/faa-checkout?type=yearly";
                                                }}
                                            >
                                                PURCHASE
                                            </Button>
                                        </div>
                                        <div className="divFaaProductFooter">
                                            IDEAL FOR IDIVIDUAL ADVSORS OR SMALL
                                            FIRMS
                                        </div>
                                    </div>
                                </Col>
                                <Col
                                    xs={24}
                                    md={8}
                                    style={{ padding: 30 }}
                                    className="monthColContainer"
                                >
                                    <div className="divFaaProduct">
                                        <div
                                            className="divFaaProductAmount"
                                            style={{
                                                fontSize: "29px",
                                                lineHeight: "1.2",
                                                marginTop: 10,
                                                paddingBottom: 3
                                            }}
                                        >
                                            FOR GROUP PRICING
                                        </div>
                                        <div className="divFaaProductDescription">
                                            IF YOU HAVE ANY QUESTION ON HOW WE
                                            CAN BETTER ACCOMOMODATE YOUR NEEDS,
                                            PLEASE REACH OUT, WE ARE EAGER TO
                                            HELP.
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "center",
                                                marginBottom: 10
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#bdd549",
                                                    borderRadius: "20px",
                                                    color: "white",
                                                    width: "80%"
                                                }}
                                            >
                                                CONTACT US
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export function YearlyModal() {
    return (
        <>
            <div
                style={{
                    background: "rgb(137,156,56)",
                    background:
                        "linear-gradient(280deg, rgba(137,156,56,1) 0%, rgba(186,213,74,1) 100%, rgba(118,16,176,1) 189%)",
                    height: "100vh"
                }}
                className="containeryear"
            >
                <div
                    style={{
                        position: "absolute",
                        marginTop: "5%"
                    }}
                    className="imageBell"
                >
                    <img
                        alt="Company logo"
                        src={window.location.origin + "/images/bell.png"}
                        style={{ width: "100%", opacity: "0.3" }}
                    />
                </div>
                <Row>
                    <Col xs={24} md={24}>
                        <div
                            style={{
                                maxWidth: "700px",
                                margin: "auto",
                                textAlign: "center"
                            }}
                        >
                            <p style={{ marginTop: "60px" }}>
                                <span
                                    style={{
                                        color: "white",
                                        fontSize: "70px",
                                        fontWeight: "800"
                                    }}
                                >
                                    HAPPY ONE YEAR!
                                </span>{" "}
                                <br></br>
                                <span
                                    style={{
                                        color: "white",
                                        fontSize: "25px"
                                    }}
                                >
                                    {" "}
                                    NO GEATER GIFT THAN TO RENEW YOUR
                                    SUBSCRIPTION <br></br>
                                    YOU HAVE SOME OPTIONS, BUT YOU KNOW WHICH IS
                                    BEST{" "}
                                </span>
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        <div
                            style={{
                                maxWidth: "650px",
                                margin: "auto"
                            }}
                        >
                            <Row>
                                <Col
                                    xs={24}
                                    md={12}
                                    style={{ padding: 30 }}
                                    className="yearColContainer"
                                >
                                    <div
                                        className="divFaaProduct yeardivFaaProduct"
                                        style={{
                                            transform: "scale(1.2)",
                                            position: "relative",
                                            left: 20
                                        }}
                                    >
                                        <div className="divFaaProductFreeyear">
                                            {" "}
                                            2 MONTHS FREE
                                        </div>
                                        <div className="divFaaProductAmount">
                                            <span className="divFaaProductAmountdollar">
                                                $
                                            </span>{" "}
                                            499{" "}
                                            <span className="divFaaProductAmountspan">
                                                /YR
                                            </span>
                                        </div>
                                        <div className="divFaaProductDescription">
                                            <b>
                                                UNLIMITED CLIENT ASSESSMENT
                                                ACCESS TO PORTAL AND DASHBOARD
                                                BEHAVORIAl FINANCE TOOLS
                                            </b>
                                            <br></br>
                                            +MORE
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#bdd549",
                                                    borderRadius: "20px",
                                                    color: "white",
                                                    width: "80%"
                                                }}
                                                onClick={() => {
                                                    window.location.href =
                                                        window.location.origin +
                                                        "/faa-checkout?type=yearly";
                                                }}
                                            >
                                                PURCHASE
                                            </Button>
                                        </div>
                                        <div className="divFaaProductFooter">
                                            IDEAL FOR IDIVIDUAL ADVSORS OR SMALL
                                            FIRMS
                                        </div>
                                    </div>
                                </Col>
                                <Col
                                    xs={24}
                                    md={12}
                                    style={{ padding: 30 }}
                                    className="yearColContainer"
                                >
                                    <div
                                        className="divFaaProduct"
                                        style={{ transform: "scale(0.85)" }}
                                    >
                                        <div className="divFaaProductAmount">
                                            <span className="divFaaProductAmountdollar">
                                                $
                                            </span>{" "}
                                            49{" "}
                                            <span className="divFaaProductAmountspan">
                                                /MO
                                            </span>
                                        </div>
                                        <div className="divFaaProductDescription">
                                            <b>
                                                UNLIMITED CLIENT ASSESSMENT
                                                ACCESS TO PORTAL AND DASHBOARD
                                                BEHAVORIAl FINANCE TOOLS
                                            </b>
                                            <br></br>
                                            +MORE
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#bdd549",
                                                    borderRadius: "20px",
                                                    color: "white",
                                                    width: "80%"
                                                }}
                                                onClick={() => {
                                                    window.location.href =
                                                        window.location.origin +
                                                        "/faa-checkout?type=monthly";
                                                }}
                                            >
                                                PURCHASE
                                            </Button>
                                        </div>
                                        <div className="divFaaProductFooter">
                                            IDEAL FOR IDIVIDUAL ADVSORS OR SMALL
                                            FIRMS
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}
