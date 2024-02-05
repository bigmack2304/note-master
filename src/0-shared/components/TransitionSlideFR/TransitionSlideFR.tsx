import React from "react";
import { Slide } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

/**
 * компонент для анимирования material ui компонентов
 * @ скрытие\появление с лева
 */
const TransitionSlideRightForvardRef = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export { TransitionSlideRightForvardRef };
