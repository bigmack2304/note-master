import React from "react";
import { Box } from "@mui/material";

type TWorkSpaceProps = {
    children: React.ReactNode;
    addClassNames?: string[];
};

function WorkSpace({ children, addClassNames = [] }: TWorkSpaceProps) {
    const defaultClassName = "WorkSpace";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return (
        <Box className={genClassName} component={"div"}>
            {children}
        </Box>
    );
}

export { WorkSpace };
