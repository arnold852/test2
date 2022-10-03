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
    Col
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import ally_image from "../../../assets/img/ally_image.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import moment from "moment";

const key = "TheMoneyCouple@2021";
const encryptor = require("simple-encryptor")(key);
export default function PageForgotPassword() {
    const [errorMessage, setErrorMessage] = React.useState();
    const [successMessage, setSuccessMessage] = React.useState();

    const {
        mutate: mutateForgotPassword,
        isLoading: isLoadingButtonForgotPassword
    } = useAxiosQuery("POST", "api/forgotpassword");

    React.useEffect(() => {
        return () => {};
    }, []);

    const onFinish = values => {
        setErrorMessage(undefined);
        let data = { email: values.email };

        mutateForgotPassword(data, {
            onSuccess: res => {
                if (res.success == false) {
                    setErrorMessage(res.data);
                    setSuccessMessage("");
                } else {
                    setSuccessMessage(
                        "Forgot password Link has been sent to your email address"
                    );
                    setErrorMessage("");

                    console.log(res.token);
                }
            },
            onError: err => {
                setErrorMessage(err.response.data.error);
            }
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
                                        To recover your password, please enter
                                        your email address
                                    </p>
                                    <Form.Item
                                        name="email"
                                        style={{ transform: "scale(1.1)" }}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Email"
                                            }
                                        ]}
                                        placeholder="Email"
                                    >
                                        <Input
                                            placeholder="Email"
                                            prefix={
                                                <UserOutlined className="site-form-item-icon" />
                                            }
                                            type="email"
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
                                            loading={
                                                isLoadingButtonForgotPassword
                                            }
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
                                        {/*  */}
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                    <Divider />
                    <div className="text-center">
                        © {moment().format("YYYY")} Financial Advisor Ally. All
                        Rights Reserved. · <a href="#">Disclaimer</a> ·{" "}
                        <a href="#">Contact</a> · <a href="#">Privacy Policy</a>
                    </div>
                </Col>
                <Col xs={0} md={3}></Col>
            </Row>
        </Layout>
    );
}
