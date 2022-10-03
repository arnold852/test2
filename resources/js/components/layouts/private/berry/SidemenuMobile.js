import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function SidemenuMobile({ toogleSidebar, setToogleSidebar }) {
    const [state, setState] = React.useState({
        top: false,
        left: true,
        bottom: false,
        right: false
    });

    const toggleDrawer = (anchor, open) => event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setToogleSidebar({ ...toogleSidebar, [anchor]: open });
    };

    const list = anchor => (
        <Box
            sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {["Inbox", "Starred", "Send email", "Drafts"].map(
                    (text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? (
                                        <InboxIcon />
                                    ) : (
                                        <MailIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    )
                )}
            </List>
            <Divider />
            <List>
                {["All mail", "Trash", "Spam"].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            {/* {["left", "right", "top", "bottom"].map(anchor => (
            ))} */}
            {/* <React.Fragment key={"left"}> */}
            <Button onClick={toggleDrawer("left", true)}>{"left"}</Button>
            <Drawer
                anchor={"left"}
                open={toogleSidebar["left"]}
                onClose={toggleDrawer("left", false)}
            >
                {list("left")}
            </Drawer>
            {/* </React.Fragment> */}
        </div>
    );
}
