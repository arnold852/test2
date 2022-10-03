import React, { useState } from "react";

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
export default function PageLogin() {
    const [errorMessage, setErrorMessage] = useState();
    const {
        mutate: mutateLogin,
        isLoading: isLoadingButtonLogin
    } = useAxiosQuery("POST", "api/login");
    const onFinish = values => {
        setErrorMessage(undefined);
        let data = { email: values.email, password: values.password };
        // console.log(values.password)
        mutateLogin(data, {
            onSuccess: res => {
                if (res.token) {
                    console.log(encryptor.encrypt(res.token));
                    localStorage.token = encryptor.encrypt(res.token);
                    localStorage.userdata = encryptor.encrypt(res.data);
                    localStorage.setItem("welcome_back_message", true);
                    location.reload();
                } else {
                    setErrorMessage("Username or Password is Invalid");
                }
            },
            onError: err => {
                setErrorMessage(err.response.data.error);
            }
        });
    };

    return (
        <Layout className="login-layout">
            <Row style={{ background: "white" }}>
                <Col xs={24} md={24} className="text-center">
                    {/* <img
                        alt="Company logo"
                        src={ally_image}
                        style={{ width: 384 }}
                    /> */}
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={7}></Col>
                <Col xs={24} md={10} style={{ padding: 10 }}>
                    <br />
                    <Card>
                        <Row>
                            <Col xs={24} md={24}>
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
                                    // initialValues={{
                                    //     email: urlParams.get("un")
                                    //         ? urlParams
                                    //               .get("un")
                                    //               .replace(" ", "+")
                                    //         : urlParams.get("inf_field_Email")
                                    //         ? urlParams
                                    //               .get("inf_field_Email")
                                    //               .replace(" ", "+")
                                    //         : localStorage.email,
                                    //     password: localStorage.password
                                    // }}
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
                                            message={errorMessage}
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
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} md={3}></Col>
            </Row>
        </Layout>
    );
}
