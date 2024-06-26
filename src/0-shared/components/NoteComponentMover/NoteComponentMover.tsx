import React, { useRef, useImperativeHandle } from "react";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import "./style.scss";
import type { Ref } from "0-shared/utils/typeHelpers";

type TNoteComponentMoverProps = {};

function NoteComponentMoverComponent({}: TNoteComponentMoverProps, ref: Ref<HTMLDivElement | null>) {
    const divElement = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => divElement.current!, [divElement.current]);

    return (
        <div className="NoteComponentMover" ref={divElement}>
            <DragHandleIcon fontSize={"large"} />
        </div>
    );
}

/**
 * элемент за который можно прицепится при drag-drope компонентов
 */
const NoteComponentMover = React.forwardRef(NoteComponentMoverComponent);

export { NoteComponentMover };
