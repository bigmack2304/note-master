import React from "react";
import { updateNoteComponentsOrder } from "5-app/GlobalState/saveDataInspectStore";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { useDrag, useDrop } from "react-dnd";

type TUseNoteComponentDragPatams = {
    wrapperRef: React.RefObject<HTMLElement>;
    moverRef: React.RefObject<HTMLElement>;
    containerRef: React.RefObject<HTMLElement>;
    dragId: string;
    fullClassName?: string;
};

type IDragItem = {
    dragId: string;
};

type IDragData = {
    isDragging: boolean;
};

type IDropItem = {};

type IDropData = {
    dropId: string;
    canDrop: boolean;
    isOver: boolean;
    item: IDragItem;
};

/**
 * позволяет перетаскивать компоненты по заметке и менять их местами
 * @prop wrapperRef - ссылка на корневой DOM елемент компонента
 * @prop moverRef - ссылка на DOM елемент за который элементы можно перетаскивать
 * @prop containerRef - ссылка на DOM елемент в который drag елементы могут поместится
 * @prop dragId - id этого компонента в структуре indexed db
 * @prop fullClassName - полное имя класса компонента
 *
 * @returns возвращается fullClassName с дополнительными drag-drop классами
 */
function useNoteComponentDrag({ wrapperRef, moverRef, containerRef, dragId, fullClassName }: TUseNoteComponentDragPatams) {
    const isNoteEdit = useAppSelector((state) => state.noteEditData.isEdit); // режим редактирования
    const actoveNote = useAppSelector((state) => state.saveDataInspect.currentNote);
    const dispatch = useAppDispatch();
    let genClassName = "";

    const [dragData, drag, dragPrev] = useDrag<IDragItem, IDragData, IDragData>({
        type: "mote_component",
        item: { dragId },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
                dragId: dragId,
            };
        },
    });

    const [dropData, drop] = useDrop<IDropItem, void, IDropData>({
        accept: "mote_component",
        collect(monitor) {
            return {
                dropId: dragId,
                canDrop: monitor.canDrop(),
                isOver: monitor.isOver(),
                item: monitor.getItem(),
            };
        },
        drop(item, monitor) {
            if (dropData.canDrop && dropData.isOver && dropData.dropId !== dropData.item.dragId) {
                // console.log(`drop: ${dropData.item.dragId} -> ${dragId}`);
                if (!actoveNote) return;
                dispatch(updateNoteComponentsOrder({ noteId: actoveNote.id, componentDragId: dropData.item.dragId, toComponentDragId: dropData.dropId }));
            }
        },
    });

    const addClasses = () => {
        if (!fullClassName) return;

        let tempClassName = fullClassName.split(" ");

        if (dropData.canDrop && dropData.isOver && dropData.dropId !== dropData.item.dragId) {
            tempClassName.push("dragZoneOk");
        }

        if (dragData.isDragging) {
            tempClassName.push("dragging");
        }

        genClassName = tempClassName.join(" ");
    };

    if (isNoteEdit) {
        drag(moverRef);
        dragPrev(wrapperRef);
        //console.log(isTouchDevice() ? "faceRef" : "wrapperRef");
        drop(containerRef);
    }

    addClasses();
    return genClassName;
}

export { useNoteComponentDrag };
