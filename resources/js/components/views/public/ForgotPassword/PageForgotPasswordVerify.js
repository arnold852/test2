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
    notification
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import assessmentBannerLogo from "../../../assets/img/assessment-banner.png";
import ally_image from "../../../assets/img/ally_image.png";
import reportGraphicLogo from "../../../assets/img/report-graphic.png";
import tmcLogo from "../../../assets/img/TMC-logo.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const key = "TheMoneyCouple@2021";
const encryptor = require("simple-encryptor")(key);

export default function PageForgotPasswordVerify({ match }) {
    let history = useHistory();
    let token = match.params.token;
    let apiUrl = `${window.location.origin}/api/`;
    let url = `forgotpassword/auth`;

    React.useEffect(() => {
        axios
            .post(
                `${apiUrl}${url}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then(res => {
                console.log("success");
            })
            .catch(err => {
                if (err.response.status === 401) {
                    history.push("/404");
                }
            });
    }, []);

    const [errorMessage, setErrorMessage] = React.useState();
    const [successMessage, setSuccessMessage] = React.useState();

    const onFinish = values => {
        axios
            .post(
                `${apiUrl}passwordverify`,
                { password: values.password },
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then(res => {
                notification.success({
                    message: "Password Updated !"
                });
                history.push("/");
            });
    };

    return (
        <Layout className="login-layout">
            <Row style={{ background: "#fff" }}>
                <Col xs={0} md={3}></Col>
                <Col xs={24} md={18} className="text-center">
                    <img
                        alt="Company logo"
                        src={ally_image}
                        style={{ width: 384 }}
                    />
                </Col>
                <Col xs={0} md={3}></Col>
            </Row>
            <br />
            <Row>
                <Col xs={0} md={3}></Col>
                <Col xs={24} md={18}>
                    <Card>
                        <Row>
                            <Col xs={24} md={24}>
                                <Card.Meta
                                    // title={
                                    //     <>
                                    //         Welcome to <br />
                                    //         The Money Couple
                                    //     </>
                                    // }
                                    className="m-b-md text-center"
                                />

                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    onFinish={onFinish}
                                    style={{
                                        maxWidth: "600px",
                                        paddingTop: 50,
                                        paddingBottom: 50,
                                        margin: "auto",
                                        textAlign: "center"
                                    }}
                                >
                                    <p style={{ fontSize: "22px" }}>
                                        Reset Password
                                    </p>
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
                                    <Form.Item
                                        name="confirm"
                                        dependencies={["password"]}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please confirm your password!"
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue(
                                                            "password"
                                                        ) === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "The two passwords that you entered do not match!"
                                                        )
                                                    );
                                                }
                                            })
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Confirm Password"
                                        />
                                    </Form.Item>

                                    {errorMessage && (
                                        <Alert
                                            className="mt-10"
                                            type="error"
                                            message={errorMessage}
                                            style={{ marginBottom: 10 }}
                                        />
                                    )}

                                    {successMessage && (
                                        <Alert
                                            className="mt-10"
                                            type="success"
                                            message={successMessage}
                                            style={{ marginBottom: 10 }}
                                        />
                                    )}

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            // loading={
                                            //     isLoadingButtonForgotPassword
                                            // git
                                            className="login-form-button tmcButton"
                                            style={{
                                                backgroundColor: "#BAD54A",
                                                borderColor: "#BAD54A",
                                                borderRadius: "4px",
                                                fontSize: 18,
                                                height: 45,
                                                fontWeight: 700
                                            }}
                                        >
                                            SUBMIT
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                    <Divider />
                    <div className="text-center">
                        © 2021 The Money Couple. All Rights Reserved. ·{" "}
                        <a href="#">Disclaimer</a> · <a href="#">Contact</a> ·{" "}
                        <a href="#">Privacy Policy</a>
                    </div>
                </Col>
                <Col xs={0} md={3}></Col>
            </Row>
        </Layout>
    );
}
