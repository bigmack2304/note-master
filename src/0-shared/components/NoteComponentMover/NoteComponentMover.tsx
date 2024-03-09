import React, { useRef, useImperativeHandle } from "react";
import type { Ref } from "0-shared/utils/typeHelpers";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import "./style.scss";

type TNoteComponentMoverProps = {};

/**
 * элемент за который можно прицепится при drag-drope компонентов
 */
function NoteComponentMoverComponent({}: TNoteComponentMoverProps, ref: Ref<HTMLDivElement | null>) {
    const divElement = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => divElement.current!, [divElement.current]);

    return (
        <div className="NoteComponentMover" ref={divElement}>
            <DragHandleIcon fontSize={"large"} />
        </div>
    );
}

const NoteComponentMover = React.forwardRef(NoteComponentMoverComponent);

export { NoteComponentMover };
