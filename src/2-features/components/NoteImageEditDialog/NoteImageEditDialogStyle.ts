import type { SxProps } from "@mui/material";

function listStyles(): SxProps {
    return {
        "& .MuiListItem-root": {
            padding: "10px 0px",
            columnGap: "20px",
        },
    };
}

function inputStyles(): SxProps {
    return {
        width: "66%",
    };
}

export { listStyles, inputStyles };
