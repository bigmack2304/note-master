import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import type { SxProps } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { useTemeMode } from "0-shared/hooks/useThemeMode";

import "./Note.scss";
import { ClosableOneLineTextInput } from "2-features/components/ClosableOneLineTextInput/ClosableOneLineTextInput";
import { DopContextMenu } from "../DopContextMenu/DopContextMenu";
import { ContextMenuEditContent } from "../ContextMenuEditContent/ContextMenuEditContent";
import { NoteHead } from "0-shared/components/NoteHead/NoteHead";
import { MoreActions } from "0-shared/components/MoreActions/MoreActions";

type TNoteProps = {
    headerText?: string;
    addClassNames?: string[];
};

const noteStyles = (theme: PaletteMode) => {
    return {
        display: "flex",
        flexDirection: "column",
    } as SxProps;
};

function Note({ headerText, addClassNames = [] }: TNoteProps) {
    const defaultClassName = "note";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    const [headerValue, setHeaderValue] = useState(headerText);
    const [isEdit, setIsEdit] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const themeValue = useTemeMode();

    const onContext = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const onMenuClose = () => {
        setAnchorEl(null);
    };

    const onEdit = () => {
        setIsEdit(true);
        setAnchorEl(null);
    };

    const onEditExit = () => {
        setIsEdit(false);
    };

    const onEditSave = (inputValue: string) => {
        setIsEdit(false);
        setHeaderValue(inputValue);
    };

    const onDelete = () => {
        setAnchorEl(null);
        setHeaderValue("");
    };

    return (
        <Box className={genClassName} component={"div"} sx={noteStyles(themeValue)}>
            {isEdit ? (
                <ClosableOneLineTextInput addClassNames={["note__head"]} inputDefValue={headerValue} placeholder="заголовок" onClose={onEditExit} onCloseSave={onEditSave} />
            ) : (
                <>
                    <MoreActions onClick={onContext}>
                        <NoteHead addClassNames={["note__head"]}>{headerValue}</NoteHead>
                    </MoreActions>
                    <DopContextMenu isOpen={isMenuOpen} onClose={onMenuClose} anchorEl={anchorEl}>
                        <ContextMenuEditContent onEditClick={onEdit} onDeleteClick={onDelete} isDeleteDisabled={headerValue !== "" ? false : true} />
                    </DopContextMenu>
                </>
            )}
        </Box>
    );
}

export { Note };
