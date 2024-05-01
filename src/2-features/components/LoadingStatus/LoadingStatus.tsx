import React, { useState } from "react";
import { EV_NAME_SAVE_DATA_REDUCER_START, EV_NAME_SAVE_DATA_REDUCER_END } from "5-app/settings";
import { useEventListener } from "0-shared/hooks/useEventListener";
import { LinearProgress, Box } from "@mui/material";
import Fade from "@mui/material/Fade";

type TLoadingStatusProps = {
    addClassNames?: string[];
};

/**
 *
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function LoadingStatus({ addClassNames = [] }: TLoadingStatusProps) {
    const defaultClassName = "LoadingStatus";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [isLoading, setIsLoading] = useState(false);

    useEventListener({
        eventName: EV_NAME_SAVE_DATA_REDUCER_START,
        onEvent() {
            setIsLoading(true);
        },
    });

    useEventListener({
        eventName: EV_NAME_SAVE_DATA_REDUCER_END,
        onEvent() {
            setIsLoading(false);
        },
    });

    return (
        <Box component={"div"} className={genClassName}>
            <Fade in={isLoading} unmountOnExit>
                <LinearProgress color="success" />
            </Fade>
        </Box>
    );
}

export { LoadingStatus };
