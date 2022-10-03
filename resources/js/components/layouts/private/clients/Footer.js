import React from "react";
import { Layout, Avatar } from "antd";
import getUserData from "../../../providers/getUserData";
import useAxiosQuery from "../../../providers/useAxiosQuery";

export default function Footer() {
    let userdata = getUserData();

    const {
        data: dataClients,
        isLoading: isLoadingTblClients,
        refetch: refetchClients,
        isFetching: isFetchingTblClients
    } = useAxiosQuery(
        "GET",
        `api/checkifexpired/${userdata.email}`,
        "check_if_expired"
    );

    React.useEffect(() => {
        {
            if (dataClients) {
                console.log(dataClients);
                if (dataClients.subscription_type == "Expired") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userdata");
                    location.href = window.location.origin;
                }
            }
        }
    }, [dataClients]);

    return (
        <Layout.Footer style={{ textAlign: "center", display: "inline" }}>
            {/* <Avatar src={fsuuLogo} size="20" alt="FSUU LOGO"/>
                <Avatar src={pcieerdLogo} size="20" alt="PCIEERD LOGO"/>
                <Avatar src={lguButuanLogo} size="20" alt="LGU BUTUAN LOGO"/>
                POWERED BY FSUU DOST */}
            Financial Advisor Ally ©2021
        </Layout.Footer>
    );
}
