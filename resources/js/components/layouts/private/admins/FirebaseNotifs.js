import { notification } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { firebaseConfig } from "../../../providers/firebaseConfig";
import firebaseMutate from "../../../providers/firebaseMutate";

const FirebaseNotifs = () => {
    const queryClient = useQueryClient();
    let init = true;
    useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized, use that one
        }
        let database = firebase.database();
        let reference = database.ref("/faa-firebase");
        // console.log("reference", reference);
        reference.on("value", snapshot => {
            if (init) {
                init = false;
            } else {
                let notif = snapshot.val();
                notif = JSON.parse(notif);
                console.log(notif);
                // if (notif.origin == window.location.origin) {
                //     if (notif.roles && notif.roles.includes(myRole)) {
                //         notification.info({
                //             message: notif.title,
                //             description: (
                //                 <div
                //                     dangerouslySetInnerHTML={{
                //                         __html: notif.message
                //                     }}
                //                 ></div>
                //             ),
                //             duration: 10
                //         });
                //     }

                //     if (notif.key_names) {
                //         notif.key_names.forEach(name => {
                //             queryClient.refetchQueries(name);
                //         });
                //     }
                // }
            }
        });
        return () => {};
    }, []);
    return <></>;
};

export default FirebaseNotifs;
