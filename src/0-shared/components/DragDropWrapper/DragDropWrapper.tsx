import React, { useRef, useImperativeHandle } from "react";
import { Box } from "@mui/material";
import "./DragDropWrapper.scss";
import type { Ref } from "0-shared/utils/typeHelpers";

type TDragDropWrapperProps = {
    addClassNames?: string[];
    children?: React.ReactNode;
};

/**
 * корневой блок для drag-drop компонентов
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 * @prop children - дочерние элементы
 */
function DragDropWrapperComponent({ children, addClassNames = [] }: TDragDropWrapperProps, ref: Ref<HTMLDivElement | null>) {
    const defaultClassName = "DragDropWrapper";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const divElement = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => divElement.current!, [divElement.current]);

    return (
        <Box className={genClassName} ref={divElement}>
            {children}
        </Box>
    );
}

const DragDropWrapper = React.forwardRef(DragDropWrapperComponent);

export { DragDropWrapper };
