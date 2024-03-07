import React, { useEffect, useRef } from "react";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { updateNoteComponentsOrder } from "5-app/GlobalState/saveDataInspectStore";
import { useEventListener } from "./useEventListener";

type TUseNoteComponentDragPatams = {
    ref: React.RefObject<HTMLElement>;
    dragId: string;
};

/**
 * позволяет перетаскивать компоненты по заметке и менять их местами
 * @prop ref - ref на элемент который можно будет перетаскивать, также на место этого элемента можно будет перетаскивать другие компонент использующие этот хук
 * @prop dragId - id этого компонента в структуре indexed db
 *
 * @returns - {onDragStart, onDragEnd, onDragLeave, onDragDrop, onDragOver}
 * @ эти функции назначаются в качестве обработчиков dragDrop событий на react компоненте
 */
function useNoteComponentDrag({ ref, dragId }: TUseNoteComponentDragPatams) {
    const isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit); // режим редактирования
    const actoveNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const dispatch = useAppDispatch();

    if (ref.current) {
        ref.current.draggable = isNoteEdit;
        ref.current.dataset.useDragId = dragId;
    }

    // начало перетаскивания
    const onDragStart = (e: React.DragEvent) => {
        if (!isNoteEdit) return;
        if (!ref.current) return;

        e.dataTransfer.setData("text/plain", `${dragId}`); // id перетаскиваемого компонента

        if (ref.current) {
            ref.current.classList.add("dragging");
        }
    };

    // завершение перетаскивания
    const onDragEnd = (e: React.DragEvent) => {
        if (!isNoteEdit) return;
        if (!ref.current) return;

        ref.current.classList.remove("dragging");
    };

    //TODO: ref тут может ссылатся на разные элементы, если фкункция помечена как drop zone то рефом будет элемсент "В" который мы пытаемся переместить элемент
    //TODO: в остальных случаях рефом будет элемент который мы перемещаем
    /////////////////////////////////////////////////////////////////////////

    // drop zone
    // покидает допустимую зону
    const onDragLeave = (e: React.DragEvent) => {
        if (!isNoteEdit) return;
        if (!ref.current) return;

        ref.current.classList.remove("dragZoneOk");
    };

    // drop zone
    // перетаскивается над допустимым элементом
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isNoteEdit) return;
        if (!ref.current) return;
        if (ref.current.classList.contains("dragging")) return;
        if (ref.current.classList.contains("dragZoneOk")) return;

        ref.current.classList.add("dragZoneOk");
        e.dataTransfer.dropEffect = "move";
    };

    // drop zone
    // сброшен в допустимую зону
    const onDragDrop = (e: React.DragEvent) => {
        if (!isNoteEdit) return;
        if (!ref.current) return;
        if (ref.current.dataset.useDragId === e.dataTransfer.getData("text/plain")) return;

        ref.current.classList.remove("dragZoneOk");
        if (ref.current.dataset.useDragId && actoveNote) {
            dispatch(updateNoteComponentsOrder({ noteId: actoveNote.id, componentDragId: e.dataTransfer.getData("text/plain"), toComponentDragId: ref.current.dataset.useDragId }));
        }
    };

    /////////////////////////////////////////////////////////////////////////
    const isPointerDown = useRef(false);
    const movedElement = useRef<HTMLElement>(null);
    const overElement = useRef<HTMLElement>(null);

    const onTouchStart = (e: React.PointerEvent) => {
        //if (!isNoteEdit) return;
        // if (!ref.current) return;
        //ref.current.dispatchEvent(new DragEvent("ragStart", { bubbles: true, dataTransfer: new DataTransfer() }));
        //console.dir(e);
        const target = (e.target as HTMLElement).parentElement as HTMLElement;

        (movedElement.current as any) = target;
        isPointerDown.current = true;
    };

    useEventListener({
        eventName: "pointermove",
        onEvent: (e: PointerEvent) => {
            //if (!isNoteEdit) return;
            // if (!ref.current) return;
            //e.stopPropagation();
            // e.preventDefault();
            const target = movedElement.current;
            if (!isPointerDown.current) return;
            if (!target) return;

            const overElem = document.elementFromPoint(e.clientX, e.clientY - 8) as HTMLElement | null;
            if (overElem) {
                //TODO: тут нужно подумать
                if (!Object.is(overElem, overElement.current)) {
                    overElement.current?.classList.remove("dragZoneOk");
                    (overElement.current as any) = overElem;
                }
                overElement.current?.classList.add("dragZoneOk");
            }

            if (!target.classList.contains("dragging")) {
                target.classList.add("dragging");
                target.style.position = "fixed";
                //target.style.touchAction = "none";
            }

            target.style.left = `${e.clientX - target.clientWidth / 2}px`;
            target.style.top = `${e.clientY - target.clientHeight + (target.clientHeight - 5)}px`;
            console.log(overElement.current);
        },
    });

    useEventListener({
        eventName: "pointerup",
        onEvent: (e: PointerEvent) => {
            const target = movedElement.current;
            if (!target) return;

            if (target.classList.contains("dragging")) target.classList.remove("dragging");
            target.style.position = "initial";
            target.style.touchAction = "initial";
            //console.dir(e);
            console.log(document.elementFromPoint(e.clientX, e.clientY));
            (movedElement.current as any) = null;
            isPointerDown.current = false;

            overElement.current?.classList.remove("dragZoneOk");
            (overElement.current as any) = null;
        },
    });

    return { onDragStart, onDragEnd, onDragLeave, onDragDrop, onDragOver, onTouchStart };
}

export { useNoteComponentDrag };
