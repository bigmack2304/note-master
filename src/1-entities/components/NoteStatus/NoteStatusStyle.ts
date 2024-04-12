import type { PaletteMode, SxProps } from "@mui/material";
import { NOTE_STATUS_COMPLETE, NOTE_STATUS_NO_COMPLETE } from "5-app/settings";

function noteStatusStyles(theme: PaletteMode, isEdit: boolean): SxProps {
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
    };
}

export { noteStatusStyles };
