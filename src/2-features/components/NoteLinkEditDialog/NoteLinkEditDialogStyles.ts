import type { SxProps } from "@mui/material";

function listStyles(): SxProps {
    return {
        "& .MuiListItem-root": {
            padding: "10px 0px",
            columnGap: "20px",
        },
    };
}

function labelInputStyles(): SxProps {
    return {
        "& .MuiListItem-root": {
            width: "60%",
        },
    };
}

export { listStyles, labelInputStyles };
