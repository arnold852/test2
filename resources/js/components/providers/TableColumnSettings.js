import {
    ArrowDownOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    RollbackOutlined,
    UndoOutlined
} from "@ant-design/icons";
import { RefreshOutlined } from "@mui/icons-material";
import { Button, Checkbox, Drawer, Menu } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";

const TableColumnSettings = ({
    showTableColumnSettings,
    setShowTableColumnSettings,
    localStorageKey,
    tableColumns,
    showColumns
}) => {
    useEffect(() => {
        // console.log('showTableColumnSettings', showTableColumnSettings.data)
        let isMobile = window.matchMedia("only screen and (max-width: 480px)")
            .matches;

        if (!isMobile) {
            localStorage.setItem(
                localStorageKey,
                JSON.stringify(showTableColumnSettings.data)
            );
        }

        return () => {};
    }, [showTableColumnSettings]);
    const handleUpdateColumnSettings = (column, show) => {
        console.log(column);
        let _columnSettings = showTableColumnSettings.data;
        let colData = _columnSettings.find(p => p.dataId == column.dataId);
        if (colData) {
            _columnSettings = _columnSettings.filter(
                p => p.dataId != column.dataId
            );
        } else {
            _columnSettings.push(column);
        }
        setShowTableColumnSettings({
            ...showTableColumnSettings,
            data: _columnSettings
        });
    };

    const [collapseExpandList, setCollapseExpandList] = useState(false);
    const [openKey, setOpenKey] = useState("");
    return (
        <Drawer
            title="Table Column Settings"
            // placement="right"
            onClose={e =>
                setShowTableColumnSettings({
                    ...showTableColumnSettings,
                    show: false
                })
            }
            visible={showTableColumnSettings.show}
        >
            <Button
                type="link"
                icon={<UndoOutlined />}
                onClick={e =>
                    setShowTableColumnSettings({
                        data: showColumns,
                        show: true
                    })
                }
            >
                Default Selection
            </Button>
            <br />
            {collapseExpandList ? (
                <Button
                    onClick={e => {
                        setCollapseExpandList(!collapseExpandList);
                        setOpenKey("");
                    }}
                    icon={<FullscreenExitOutlined />}
                    type="link"
                >
                    Collapse All
                </Button>
            ) : (
                <Button
                    onClick={e => {
                        setCollapseExpandList(!collapseExpandList);
                        setOpenKey("");
                    }}
                    icon={<FullscreenOutlined />}
                    type="link"
                >
                    Expand All
                </Button>
            )}

            {tableColumns.map((column, column_key) => {
                let menuItems = [];
                column.children.map((child, child_key) => {
                    menuItems.push(
                        <Menu.Item key={child_key}>
                            <Checkbox
                                checked={
                                    showTableColumnSettings &&
                                    showTableColumnSettings.data.find(
                                        p => p.dataId == child.dataId
                                    )
                                        ? true
                                        : false
                                }
                                onChange={e =>
                                    handleUpdateColumnSettings(
                                        child,
                                        e.target.checked
                                    )
                                }
                            >
                                {child.title}
                            </Checkbox>
                        </Menu.Item>
                    );
                });
                return (
                    <Menu
                        mode="inline"
                        key={column_key}
                        openKeys={
                            openKey != ""
                                ? [openKey]
                                : collapseExpandList
                                ? [column.label]
                                : []
                        }
                    >
                        <Menu.SubMenu
                            title={column.label}
                            key={column.label}
                            onTitleClick={e => {
                                if (column.label == openKey) {
                                    setCollapseExpandList(false);
                                    setOpenKey("");
                                } else {
                                    setOpenKey(column.label);
                                }
                            }}
                        >
                            {menuItems}
                        </Menu.SubMenu>
                    </Menu>
                );
                // return (
                //     <div key={key}>
                //         <Checkbox
                //             checked={column.show}
                //             onChange={e =>
                //                 handleUpdateColumnSettings(
                //                     key,
                //                     e.target.checked
                //                 )
                //             }
                //         >
                //             {column.title}
                //         </Checkbox>
                //     </div>
                // );
            })}
        </Drawer>
    );
};

export default TableColumnSettings;
