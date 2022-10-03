import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function PaginationSize(props) {
    const { pageFiltersUser, setPageFiltersUser } = props;
    // const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        // setPage(value);
        setPageFiltersUser({
            ...pageFiltersUser,
            page: value
        });
    };
    return (
        <Stack spacing={2} className="table-pagination">
            <Pagination
                count={pageFiltersUser.page_size}
                boundaryCount={1}
                defaultPage={pageFiltersUser.page_total}
                page={pageFiltersUser.page}
                onChange={handleChange}
                renderItem={item => (
                    <PaginationItem
                        components={{
                            previous: ArrowBackIcon,
                            next: ArrowForwardIcon
                        }}
                        {...item}
                    />
                )}
            />
        </Stack>
    );
}
