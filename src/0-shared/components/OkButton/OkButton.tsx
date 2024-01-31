import React from "react";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import type { SxProps } from "@mui/material";

type TOkButtonProps = {
    onClick?: (e: React.MouseEvent) => void;
    addClassNames?: string[];
};

const ButtonStyle: SxProps = {
    padding: "5px",
};

function OkButton({ onClick = () => {}, addClassNames = [] }: TOkButtonProps) {
    const defaultClassName = "OkButton";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <IconButton className={genClassName} aria-label="подтвердить" size="large" sx={ButtonStyle} onClick={onClick}>
            <DoneIcon fontSize="large" />
        </IconButton>
    );
}

export { OkButton };
