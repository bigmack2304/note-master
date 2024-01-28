import React from "react";
import { Slide } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

const TransitionSlideRightForvardRef = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export { TransitionSlideRightForvardRef };
