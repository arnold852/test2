import React, { useState } from "react";
import TablePagination from "@mui/material/TablePagination";

export default function PaginationDropdown(props) {
    const { pageFiltersUser, setPageFiltersUser } = props;
    const [page, setPage] = useState(2);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    //     // setPageFiltersUser({
    //     //     ...pageFiltersUser,
    //     //     page_size: newPage
    //     // });
    // };

    const handleChangeRowsPerPage = event => {
        // setRowsPerPage(parseInt(event.target.value, 10));
        setPageFiltersUser({
            ...pageFiltersUser,
            page_size: parseInt(event.target.value, 10)
        });
        // setPage(0);
    };

    return (
        <TablePagination
            className="table-dropdown"
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={10}
            rowsPerPage={pageFiltersUser.page_size}
            // rowsPerPage={rowsPerPage}
            // page={page}
            // onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
}
