import React, { useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    InputNumber,
    Space,
    DatePicker,
    Divider,
    notification,
    Image,
    Typography,
    Steps,
    Alert
} from "antd";
import countryList from "react-select-country-list";
import {
    CompactPicker,
    PhotoshopPicker,
    CirclePicker,
    MaterialPicker
} from "react-color";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import notificationErrors from "../../../providers/notificationErrors";

import {
    ArrowLeftOutlined,
    LoadingOutlined,
    LockOutlined,
    RightOutlined,
    SaveOutlined
} from "@ant-design/icons";
import getUserData from "../../../providers/getUserData";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/es/input/TextArea";
import Text from "antd/lib/typography/Text";
import getToken from "../../../providers/getToken";
import SkeletonInput from "antd/lib/skeleton/Input";

import ReactPlayer from "react-player";
const key = "TheMoneyCouple@2021";
const encryptor = require("simple-encryptor")(key);
const PageWelcome = () => {
    let userdata = getUserData();
    const { Title } = Typography;
    const [formWelcome] = Form.useForm();
    let history = useHistory();
    const options = useMemo(() => countryList().getData(), []);
    const {
        data: dataClient,
        isLoading: isLoadingDataClient,
        isFetching: isFetchingDataClient
    } = useAxiosQuery(
        "GET",
        `api/client/${userdata.id}`,
        `edit_client_${userdata.id}`
    );

    const [imgUpload, setImgUpload] = React.useState("");
    const [isUploading, setIsUploading] = React.useState(false);
    React.useEffect(() => {
        if (dataClient) {
            setImgUpload(dataClient.data.client_logo);
            setClientColor(
                dataClient.data.client_color
                    ? dataClient.data.client_color
                    : "#b8d349"
            );
            if (dataClient.data.client_color_bubble_right) {
                setClientBubbleRightColor(
                    dataClient.data.client_color_bubble_right
                );
            }
            if (dataClient.data.client_color_bubble_left) {
                setClientBubbleLeftColor(
                    dataClient.data.client_color_bubble_left
                );
            }
            if (dataClient.data.client_color_button) {
                setClientButtonColor(dataClient.data.client_color_button);
            }
        }
    }, [dataClient]);

    const [clientColor, setClientColor] = React.useState("");
    const [clientBubbleRightColor, setClientBubbleRightColor] = React.useState(
        "#bdd549"
    );
    const [clientBubbleLeftColor, setClientBubbleLeftColor] = React.useState(
        "#52b3cd"
    );

    const [clientButtonColor, setClientButtonColor] = React.useState("#bdd549");
    const [orgName, setOrgName] = React.useState("");

    const {
        mutate: mutateEditClient,
        isLoading: isLoadingEditClient
    } = useAxiosQuery("UPDATE", "api/client", `edit_client_${userdata.id}`);

    const onFinish = values => {
        console.log("values", values);
        var newObj = {
            ...values,
            client_logo: imgUpload,
            client_color: clientColor,
            client_color_bubble_right: clientBubbleRightColor,
            client_color_bubble_left: clientBubbleLeftColor,
            client_color_button: clientButtonColor,
            from_welcome: "welcome",
            short_name: shortName,
            org_name: orgName
        };

        console.log(newObj);
        // if (values.password == values.confirm_password) {
        delete newObj.email;
        mutateEditClient(newObj, {
            onSuccess: res => {
                console.log(res);
                if (currentStep == 8) {
                    notification.success({
                        message: " Settings Successfully Updated "
                    });

                    window.location.replace(
                        window.location.origin + "/clients"
                    );
                }

                // history.push("/settings");
            },
            onError: err => {
                console.log(err);
                notificationErrors(err);
            }
        });
        // } else {
        //     notification.error({ message: "Confirm Password mismatch" });
        // }
    };

    const handleChangeIcon = e => {
        let files = e.target.files;
        getBase64(files[0], imageUrl => {
            setIsUploading(true);
            setImgUpload(imageUrl);
        });
    };

    const changeColor = color => {
        console.log(color);
        setClientColor(color.hex);
    };
    const changeColorR = color => {
        console.log(color.hex);
        setClientBubbleRightColor(color.hex);
    };

    const changeColorL = color => {
        console.log(color.hex);
        setClientBubbleLeftColor(color.hex);
    };

    const changeColorButton = color => {
        console.log(color.hex);
        setClientButtonColor(color.hex);
    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    React.useEffect(() => {
        console.log(dataClient);
        console.log("id", userdata.id);
        if (dataClient) {
            setOrgName(dataClient.data.org_name);
        }
    }, [dataClient]);

    const [currentStep, setCurrentStep] = useState(0);
    const stepChange = e => {
        setCurrentStep(e);
    };

    useEffect(() => {
        console.log(currentStep);
        if (currentStep != 0 && currentStep != 8) {
            console.log(currentStep);
            formWelcome.submit();
        }
        return () => {};
    }, [currentStep]);

    const NextButton = () => {
        return (
            <>
                <Divider />
                <Button
                    type="primary"
                    onClick={e => setCurrentStep(currentStep + 1)}
                >
                    NEXT <RightOutlined />
                </Button>
            </>
        );
    };

    const [shortName, setShortName] = useState("");

    const {
        mutate: mutateChangePassword,
        isLoading: isLoadingChangePassword
    } = useAxiosQuery("POST", "api/passwordverify");
    const handleChangePasswordForm = values => {
        mutateChangePassword(
            { password: values.password },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Password Updated !"
                    });
                    setCurrentStep(currentStep + 1);
                }
            }
        );
    };

    const {
        mutate: mutateSkipClient,
        isLoading: isLoadingSkipClient
    } = useAxiosQuery("POST", "api/skip");

    const skipwelcome = () => {
        var newObj = {
            from_welcome: "welcome",
            id: userdata.id
        };

        console.log(newObj);
        mutateSkipClient(newObj, {
            onSuccess: res => {
                console.log(res);
                window.location.replace(window.location.origin + "/clients");
                // history.push("/settings");
            },
            onError: err => {
                console.log(err);
                notificationErrors(err);
            }
        });
    };

    const { Option } = Select;

    const { mutate: mutateviewas, isLoading: isLoadingviewas } = useAxiosQuery(
        "POST",
        "api/generate/token/user",
        "clients_table_viewas"
    );

    function onChange(value) {
        var newObj = {
            id: value,
            viewas: localStorage.viewas
        };
        mutateviewas(newObj, {
            onSuccess: res => {
                console.log(res);
                localStorage.token = encryptor.encrypt(res.data.token);
                localStorage.userdata = encryptor.encrypt(
                    JSON.parse(res.data.userdata)
                );
                localStorage.viewas = true;
                // // window.location.reload();
                var url = window.location.origin;
                window.location.href = url;
            },
            onError: err => {
                console.log(err);
            }
        });
    }

    // React.useEffect(() => {
    //     refetchClients();
    //     return () => {};
    // }, []);

    // for table
    const {
        data: dataClients,
        isLoading: isLoadingTblClients,
        refetch: refetchClients,
        isFetching: isFetchingTblClients
    } = useAxiosQuery("GET", `api/viewas/client`, "clients_table_viewas");

    let userdata_admin = encryptor.decrypt(localStorage.userdata_admin);
    const handleBackToSuperAdmin = () => {
        viewAsBack(userdata_admin.id, true);
    };

    const viewAsBack = (id, backtoadmin = false) => {
        var newObj = {
            id: id,
            viewas: localStorage.viewas
        };

        mutateviewas(newObj, {
            onSuccess: res => {
                console.log(res);
                localStorage.token = encryptor.encrypt(res.data.token);
                localStorage.userdata = encryptor.encrypt(
                    JSON.parse(res.data.userdata)
                );
                if (backtoadmin) {
                    localStorage.viewas = false;
                    localStorage.removeItem("userdata_admin");
                }

                var url = window.location.origin;
                window.location.href = url;
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    const divStyle = {
        width: "20px"
    };

    return (
        <div
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
            <Layout.Content
                className="site-layout-background PageWelcome"
                style={{
                    margin: "24px 16px 0",
                    minHeight: 280,
                    textAlign: "center"
                }}
            >
                <Card style={{ margin: "auto" }}>
                    <Row>
                        <Col xs={0} md={6}>
                            <Steps
                                size="small"
                                current={currentStep}
                                onChange={e => stepChange(e)}
                                className="site-navigation-steps"
                                direction="vertical"
                                // style={{width: }}
                            >
                                <Steps.Step
                                    title="Welcome"
                                    // description="This is a description."
                                />
                                <Steps.Step
                                    title="Assessment Link"
                                    description="Set your Custom Assessment Link"
                                />
                                <Steps.Step
                                    title="Logo"
                                    description="Upload your Logo"
                                />
                                <Steps.Step
                                    title="Header Color"
                                    description="Set your Header Color"
                                />
                                <Steps.Step
                                    title="Welcome Message"
                                    description="Set your Welcome Message"
                                />
                                <Steps.Step
                                    title="Bubble Colors"
                                    description="Set your Bubble Colors"
                                />
                                <Steps.Step
                                    title="Button Color"
                                    description="Set your Button Color"
                                />
                                <Steps.Step
                                    title="Thank You Message"
                                    description="Set your Thank you Message"
                                />
                                <Steps.Step
                                    title="Disclaimer"
                                    description="Set your Disclaimer"
                                />
                            </Steps>
                        </Col>
                        <Col xs={24} md={0}>
                            <Steps
                                size="small"
                                current={currentStep}
                                onChange={e => stepChange(e)}
                                className="site-navigation-steps"
                                // direction="vertical"
                                // style={{width: }}
                            >
                                <Steps.Step
                                // title="Welcome"
                                // description="This is a description."
                                />
                                <Steps.Step
                                // title="Assessment Link"
                                // description="Set your Custom Assessment Link"
                                />
                                <Steps.Step
                                // title="Logo"
                                // description="Upload your Logo"
                                />
                                <Steps.Step
                                // title="Head Color"
                                // description="Set your Head Color"
                                />
                                <Steps.Step
                                // title="Welcome Message"
                                // description="Set your Welcome Message"
                                />
                                <Steps.Step
                                // title="Bubble Colors"
                                // description="Set your Bubble Colors"
                                />
                                <Steps.Step
                                // title="Button Color"
                                // description="Set your Button Color"
                                />
                                <Steps.Step
                                // title="Thank You Message"
                                // description="Set your Thank you Message"
                                />
                                <Steps.Step
                                // title="Disclaimer"
                                // description="Set your Disclaimer"
                                />
                            </Steps>
                        </Col>
                        <Col xs={24} md={18}>
                            {" "}
                            <div
                                style={{
                                    maxWidth: 500,
                                    margin: "auto",
                                    paddingTop: 20
                                }}
                                // extra={
                                //     <Link to="/clients">
                                //         <Button type="primary">
                                //             <ArrowLeftOutlined /> Back to list
                                //         </Button>
                                //     </Link>
                                // }
                            >
                                {localStorage.viewas == "true" && (
                                    <div
                                        style={{
                                            marginTop: 10,
                                            textAlign: "center",
                                            width: "150px",
                                            display: "grid",
                                            position: "absolute",
                                            right: "-30px",
                                            top: "27px"
                                        }}
                                    >
                                        <small
                                            style={{
                                                display: "block",
                                                marginBottom: 5,
                                                color: "black",
                                                marginRight: "20px"
                                            }}
                                        >
                                            View As
                                        </small>

                                        <Select
                                            showSearch
                                            style={{ width: "90%" }}
                                            placeholder="Select an Advisor"
                                            optionFilterProp="children"
                                            onChange={onChange}
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {dataClients &&
                                                dataClients.data.map(option => {
                                                    return (
                                                        <>
                                                            <Option
                                                                value={
                                                                    option.id
                                                                }
                                                            >
                                                                {option.name}
                                                            </Option>
                                                        </>
                                                    );
                                                })}
                                        </Select>

                                        <a
                                            style={{ color: "black" }}
                                            onClick={e =>
                                                handleBackToSuperAdmin()
                                            }
                                        >
                                            <small>Back to Admin View</small>
                                        </a>
                                        <br></br>
                                    </div>
                                )}

                                <div
                                    className="skipWelcome"
                                    onClick={() => skipwelcome()}
                                >
                                    Skip
                                </div>
                                {isLoadingDataClient || isFetchingDataClient ? (
                                    currentStep == 0 &&
                                    currentStep == 8 && <LoadingOutlined spin />
                                ) : (
                                    <>
                                        <div
                                            className={
                                                currentStep != 0 ? "hide" : ""
                                            }
                                        >
                                            <Title className="text-center">
                                                WELCOME{" "}
                                            </Title>
                                            <div className="player-wrapper">
                                                {currentStep == 0 && (
                                                    <iframe
                                                        width="100%"
                                                        height="315"
                                                        src="https://www.youtube.com/embed/4K8UYhYTrrw?autoplay=1"
                                                        title="YouTube video player"
                                                        frameborder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowfullscreen
                                                    ></iframe>
                                                )}
                                            </div>
                                            <br></br>
                                            <Meta title="Please Customize Your Settings"></Meta>
                                            <br></br>
                                            <br></br>
                                            <p style={{ fontSize: "22px" }}>
                                                Organization Name
                                            </p>

                                            <div>
                                                <Meta description="Set your Organization Name"></Meta>
                                                <div
                                                    style={{
                                                        marginTop: 10
                                                    }}
                                                ></div>
                                                <Image
                                                    width={150}
                                                    src={
                                                        window.location.origin +
                                                        "/images/FAA-orgname.jpg"
                                                    }
                                                />
                                            </div>

                                            <Input
                                                type="text"
                                                placeholder="Organization Name"
                                                onChange={e =>
                                                    setOrgName(e.target.value)
                                                }
                                                value={orgName}
                                            />

                                            <Form
                                                name="normal_login"
                                                className="login-form"
                                                onFinish={
                                                    handleChangePasswordForm
                                                }
                                                style={{
                                                    maxWidth: "600px",
                                                    paddingTop: 50,
                                                    paddingBottom: 50,
                                                    margin: "auto",
                                                    textAlign: "center"
                                                }}
                                            >
                                                <p style={{ fontSize: "22px" }}>
                                                    Reset your Password
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
                                                        ({
                                                            getFieldValue
                                                        }) => ({
                                                            validator(
                                                                _,
                                                                value
                                                            ) {
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

                                                {/* {errorMessage && (
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
                                            )} */}

                                                {/* <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    // loading={
                                                    //     isLoadingButtonForgotPassword
                                                    // }
                                                    className="login-form-button tmcButton"
                                                    style={{
                                                        backgroundColor:
                                                            "#ff7631",
                                                        borderRadius: "4px",
                                                        fontSize: 18,
                                                        height: 45,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    SUBMIT
                                                </Button> */}

                                                <div>
                                                    <Text>
                                                        Set it to something
                                                        memorable and secure.
                                                    </Text>
                                                </div>
                                                <Divider />
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    // onClick={e =>
                                                    //     setCurrentStep(
                                                    //         currentStep + 1
                                                    //     )
                                                    // }
                                                    loading={
                                                        isLoadingChangePassword
                                                    }
                                                >
                                                    NEXT <RightOutlined />
                                                </Button>
                                            </Form>

                                            {/* <NextButton /> */}
                                        </div>
                                        <Form
                                            onFinish={onFinish}
                                            initialValues={dataClient.data}
                                            layout="vertical"
                                            form={formWelcome}
                                            // onValuesChange={(changedValues, values) => {
                                            //     console.log(changedValues, values);
                                            // }}
                                        >
                                            <Row>
                                                <Col xs={24}>
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="id"
                                                        className="hide"
                                                    >
                                                        <Input name="id" />
                                                    </Form.Item>
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 1
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="short_name"
                                                        label={
                                                            <Meta
                                                                title="Assessment Link"
                                                                description="Set Your Custom
                                                Assessment Link"
                                                            ></Meta>
                                                        }
                                                    >
                                                        <Row>
                                                            <Col xs={0} md={24}>
                                                                {
                                                                    window
                                                                        .location
                                                                        .origin
                                                                }
                                                                /cobranded/
                                                                {shortName != ""
                                                                    ? shortName
                                                                    : "{shortname}"}
                                                            </Col>
                                                            <Col xs={24} md={0}>
                                                                {
                                                                    window
                                                                        .location
                                                                        .origin
                                                                }
                                                                <br />
                                                                /cobranded/
                                                                {shortName != ""
                                                                    ? shortName
                                                                    : "{shortname}"}
                                                            </Col>
                                                        </Row>
                                                        <Divider />
                                                        <Input
                                                            name="short_name"
                                                            placeholder="Short Name"
                                                            type="text"
                                                            onChange={e =>
                                                                setShortName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onPressEnter={e =>
                                                                e.preventDefault()
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <NextButton />
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 2
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Meta
                                                        title="Logo"
                                                        description="Upload your Logo"
                                                    ></Meta>
                                                    <div
                                                        style={{
                                                            marginTop: 10
                                                        }}
                                                    ></div>
                                                    <Image
                                                        width={150}
                                                        src={
                                                            window.location
                                                                .origin +
                                                            "/images/FAA-logo-example.jpg"
                                                        }
                                                    />
                                                    <Divider />
                                                    {isUploading == false && (
                                                        <Image
                                                            width={200}
                                                            src={
                                                                window.location
                                                                    .origin +
                                                                "/images/no-image.png"
                                                            }
                                                        />
                                                    )}
                                                    {isUploading == true && (
                                                        <Image
                                                            width={200}
                                                            src={imgUpload}
                                                        />
                                                    )}
                                                    <Input
                                                        name="client_logo"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e =>
                                                            handleChangeIcon(e)
                                                        }
                                                        style={{
                                                            width: "200px",
                                                            margin: "auto",
                                                            marginBottom: "30px"
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            color: "#3CB4CA"
                                                        }}
                                                    >
                                                        Recommended image width
                                                        400px
                                                        <br />
                                                        (larger images can slow
                                                        down page load speed)
                                                    </span>
                                                    <NextButton />
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 3
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="client_color"
                                                        label={
                                                            <div>
                                                                <Meta
                                                                    title="Header Color"
                                                                    description="Set your Header Color"
                                                                ></Meta>
                                                                <div
                                                                    style={{
                                                                        marginTop: 10
                                                                    }}
                                                                ></div>

                                                                <Image
                                                                    width={150}
                                                                    src={
                                                                        window
                                                                            .location
                                                                            .origin +
                                                                        "/images/FAA-header.jpg"
                                                                    }
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <Divider />
                                                        <div className="react-color-container">
                                                            <CompactPicker
                                                                color={
                                                                    clientColor
                                                                }
                                                                onChangeComplete={e =>
                                                                    changeColor(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <NextButton />
                                                    </Form.Item>
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 4
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="welcome_message"
                                                        label={
                                                            <div>
                                                                <Meta
                                                                    title="Welcome Message"
                                                                    description="Set your Welcome Message"
                                                                ></Meta>
                                                                <div
                                                                    style={{
                                                                        marginTop: 10
                                                                    }}
                                                                ></div>
                                                                <Image
                                                                    width={150}
                                                                    src={
                                                                        window
                                                                            .location
                                                                            .origin +
                                                                        "/images/FAA-welcome.jpg"
                                                                    }
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <TextArea
                                                            style={{
                                                                width: "100%"
                                                            }}
                                                            placeholder="Welcome Message"
                                                            onPressEnter={e =>
                                                                e.preventDefault()
                                                            }
                                                        ></TextArea>
                                                    </Form.Item>
                                                    <NextButton />
                                                </Col>

                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 5
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Meta
                                                        title="Bubble Colors"
                                                        description="Set your Bubble Colors"
                                                    ></Meta>
                                                    <div
                                                        style={{
                                                            marginTop: 10
                                                        }}
                                                    ></div>
                                                    <Image
                                                        width={150}
                                                        src={
                                                            window.location
                                                                .origin +
                                                            "/images/FAA-BubbleExample.jpg"
                                                        }
                                                    />
                                                    <Divider />
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="client_color_bubble_left"
                                                        label="Set Your Bubble-Left Color"
                                                        className="CompactPicker"
                                                    >
                                                        <div className="react-color-container">
                                                            {" "}
                                                            <CompactPicker
                                                                color={
                                                                    clientBubbleLeftColor
                                                                }
                                                                onChangeComplete={e =>
                                                                    changeColorL(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Form.Item>{" "}
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 5
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="client_color_bubble_right"
                                                        label="Set Your Bubble-Right Color"
                                                        className="CompactPicker"
                                                    >
                                                        <div className="react-color-container">
                                                            <CompactPicker
                                                                color={
                                                                    clientBubbleRightColor
                                                                }
                                                                onChangeComplete={e =>
                                                                    changeColorR(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Form.Item>
                                                    <NextButton />
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 6
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="client_color_button"
                                                        label={
                                                            <div>
                                                                <Meta
                                                                    title="Button Color"
                                                                    description="Set your Next Button Color"
                                                                ></Meta>{" "}
                                                                <div
                                                                    style={{
                                                                        marginTop: 10
                                                                    }}
                                                                ></div>
                                                                <Image
                                                                    width={150}
                                                                    src={
                                                                        window
                                                                            .location
                                                                            .origin +
                                                                        "/images/FAA-NextButtonExample.jpg"
                                                                    }
                                                                />
                                                            </div>
                                                        }
                                                        className="CompactPicker"
                                                    >
                                                        <Divider />
                                                        <div className="react-color-container">
                                                            <CompactPicker
                                                                color={
                                                                    clientButtonColor
                                                                }
                                                                onChangeComplete={e =>
                                                                    changeColorButton(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Form.Item>
                                                    <NextButton />
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 7
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="message"
                                                        label={
                                                            <div>
                                                                {" "}
                                                                <Meta
                                                                    title="Thank you Message"
                                                                    description="Set your Thank you Message"
                                                                ></Meta>
                                                                <div
                                                                    style={{
                                                                        marginTop: 10
                                                                    }}
                                                                ></div>
                                                                <Image
                                                                    width={150}
                                                                    src={
                                                                        window
                                                                            .location
                                                                            .origin +
                                                                        "/images/FAA-ThankYouMessageExample.jpg"
                                                                    }
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <TextArea
                                                            style={{
                                                                width: "100%"
                                                            }}
                                                            placeholder="Thank you Message"
                                                            onPressEnter={e =>
                                                                e.preventDefault()
                                                            }
                                                        ></TextArea>
                                                    </Form.Item>
                                                    <NextButton />
                                                </Col>
                                                <Col
                                                    xs={24}
                                                    className={
                                                        currentStep != 8
                                                            ? "hide"
                                                            : ""
                                                    }
                                                >
                                                    <Form.Item
                                                        style={{
                                                            width: "100%"
                                                        }}
                                                        name="disclaimer"
                                                        label={
                                                            <Meta
                                                                title="Disclaimer"
                                                                description="Set your Disclaimer"
                                                            ></Meta>
                                                        }
                                                    >
                                                        <TextArea
                                                            style={{
                                                                width: "100%"
                                                            }}
                                                            placeholder="Disclaimer"
                                                            onPressEnter={e =>
                                                                e.preventDefault()
                                                            }
                                                        ></TextArea>
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <div
                                                className={
                                                    currentStep != 8
                                                        ? "hide"
                                                        : ""
                                                }
                                            >
                                                <Divider />
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    style={{ width: "200px" }}
                                                    loading={
                                                        isLoadingEditClient
                                                    }
                                                    icon={<SaveOutlined />}
                                                >
                                                    Save
                                                </Button>
                                                <br></br>
                                            </div>
                                        </Form>
                                    </>
                                )}
                            </div>{" "}
                        </Col>
                    </Row>
                </Card>
            </Layout.Content>
        </div>
    );
};

export default PageWelcome;
