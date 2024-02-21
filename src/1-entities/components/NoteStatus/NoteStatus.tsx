import React from "react";
import { Stepper, Step, StepLabel, Typography } from "@mui/material";
import type { SxProps, PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { useAppSelector } from "0-shared/hooks/useAppSelector";
import { updateNoteCompleted } from "5-app/GlobalState/saveDataInspectStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { NOTE_STATUS_COMPLETE, NOTE_STATUS_NO_COMPLETE } from "5-app/settings";

type TNoteStatusProps = {
    addClassNames?: string[];
};

const noteStatusStyles = (theme: PaletteMode, isEdit: boolean) => {
    return {
        "& .MuiSvgIcon-root.Mui-completed": {
            color: NOTE_STATUS_COMPLETE,
        },
        "& .MuiSvgIcon-root.Mui-active": {
            color: NOTE_STATUS_NO_COMPLETE,
        },
        "& .MuiStepLabel-iconContainer.Mui-active + .MuiStepLabel-labelContainer .MuiTypography-root": {
            color: theme === "light" ? "#00000061" : "#f9f9f961",
        },
        "& .MuiSvgIcon-root .MuiStepIcon-text": {
            fill: theme === "light" ? "#000000de" : "#f9f9f9de",
        },
        "& .MuiSvgIcon-root": {
            cursor: isEdit ? "pointer" : "initial",
            transition: "transform ease-in 0.1s",
        },
        "& .MuiSvgIcon-root:hover": {
            transform: isEdit ? "scale(1.22)" : "scale(1.0)",
        },
    } as SxProps;
};

const noteStatusSteps = ["В процессе написания", "Завершено"];

/**
 * Компонент отображает и позволяет выставить статус заметки. (закончена она или нет)
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function NoteStatus({ addClassNames = [] }: TNoteStatusProps) {
    const defaultClassName = "NoteStatus";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const currentNote = useAppSelector((store) => store.saveDataInspect.currentNote);
    const isEdit = useAppSelector((store) => store.noteEditData.isEdit);
    const activeStep = currentNote && currentNote.completed ? 2 : 1;
    const completedSteps = currentNote && currentNote.completed ? [0, 1] : [0];
    const themeValue = useTemeMode();
    const dispatch = useAppDispatch();

    const isStepComleted = (step: number) => {
        return completedSteps.includes(step);
    };

    const onStepClick = (stepNum: number) => {
        if (!isEdit) return;
        if (!currentNote) return;
        const isComplete = stepNum >= noteStatusSteps.length - 1;
        dispatch(updateNoteCompleted({ noteId: currentNote.id, newCompleted: isComplete }));
    };

    return (
        <div className={genClassName}>
            <Stepper className="NoteStatus__stepper" sx={noteStatusStyles(themeValue, isEdit)} activeStep={activeStep} orientation="horizontal">
                {noteStatusSteps.map((value, index) => {
                    const isComplete = isStepComleted(index) ? true : false;

                    return (
                        <Step key={value} completed={isComplete} onClick={onStepClick.bind(null, index)}>
                            <StepLabel optional={<Typography variant="caption">{value}</Typography>} />
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}

export { NoteStatus };
