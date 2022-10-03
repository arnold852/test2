import { useMutation, useQuery, useQueryClient } from "react-query";
import getToken from "./getToken";

export default function useAxiosQuery(
    method,
    url,
    key_name,
    onSuccessFunction
) {
    let apiUrl = `${window.location.origin}/`;
    const queryClient = useQueryClient();
    const token = getToken();
    switch (method) {
        case "POST_FILE":
            return useMutation(
                data =>
                    axios
                        .post(`${apiUrl}${url}`, data, {
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "multipart/form-data"
                            }
                        })
                        .then(res => res.data),
                {
                    onSuccess: () => {
                        if (onSuccessFunction) onSuccessFunction();
                        if (key_name) {
                            if (typeof key_name === "string") {
                                queryClient.refetchQueries(key_name);
                            } else {
                                key_name.forEach(name => {
                                    queryClient.refetchQueries(name);
                                });
                            }
                        }
                    }
                }
            );
            break;
        case "POST":
            return useMutation(
                data =>
                    axios
                        .post(`${apiUrl}${url}`, data, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        .then(res => res.data),
                {
                    onSuccess: () => {
                        if (onSuccessFunction) onSuccessFunction();
                        if (key_name) {
                            if (typeof key_name === "string") {
                                queryClient.refetchQueries(key_name);
                            } else {
                                key_name.forEach(name => {
                                    queryClient.refetchQueries(name);
                                });
                            }
                        }
                    }
                }
            );
            break;
        case "UPDATE":
            return useMutation(
                data =>
                    axios
                        .put(`${apiUrl}${url}/${data.id}`, data, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        .then(res => res.data),
                {
                    onSuccess: () => {
                        if (onSuccessFunction) onSuccessFunction();
                        console.log(key_name);
                        if (key_name) {
                            if (typeof key_name === "string") {
                                queryClient.refetchQueries(key_name);
                            } else {
                                key_name.forEach(name => {
                                    queryClient.refetchQueries(name);
                                });
                            }
                        }
                    }
                }
            );
            break;
        case "DELETE":
            return useMutation(
                data =>
                    axios
                        .delete(`${apiUrl}${url}/${data.id}`, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        .then(res => res.data),
                {
                    onSuccess: () => {
                        if (onSuccessFunction) onSuccessFunction();
                        if (key_name) {
                            if (typeof key_name === "string") {
                                queryClient.refetchQueries(key_name);
                            } else {
                                key_name.forEach(name => {
                                    queryClient.refetchQueries(name);
                                });
                            }
                        }
                    }
                }
            );
            break;
        case "GET":
            return useQuery(
                key_name,
                () =>
                    axios
                        .get(`${apiUrl}${url}`, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        .then(res => res.data),
                {
                    retry: 1,
                    retryDelay: 500,
                    fetchOnWindowFocus: false,
                    refetchOnWindowFocus: false,
                    onSuccess: res => {
                        if (onSuccessFunction) onSuccessFunction(res);
                    }
                }
            );
            break;

        case "GET_MANUAL":
            return useQuery(
                key_name,
                () =>
                    axios
                        .get(`${apiUrl}${url}`, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        .then(res => res.data),
                {
                    enabled: false,
                    retry: 1,
                    retryDelay: 500,
                    fetchOnWindowFocus: false,
                    refetchOnWindowFocus: false,
                    onSuccess: res => {
                        if (onSuccessFunction) onSuccessFunction(res);
                    }
                }
            );
            break;

        default:
            break;
    }
}
