import React, { useState } from "react";
import { IconButton } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

type TNewTagButtonProps = {};

/**
 * кнопка, показывающая диалоговое окно с возможностью добавить новый тег в проект
 */
function NewTagButton({}: TNewTagButtonProps) {
    const onClick = () => {
        console.log("klick");
    };

    return (
        <IconButton aria-label="упраление тегами" title={"упраление тегами"} size="large" onClick={onClick}>
            <LocalOfferIcon fontSize="small" />
        </IconButton>
    );
}

export { NewTagButton };
