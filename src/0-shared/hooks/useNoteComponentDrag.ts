import React from "react";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { updateNoteComponentsOrder } from "5-app/GlobalState/saveDataInspectStore";

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

    return { onDragStart, onDragEnd, onDragLeave, onDragDrop, onDragOver };
}

export { useNoteComponentDrag };
