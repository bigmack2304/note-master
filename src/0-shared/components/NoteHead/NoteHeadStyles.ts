import Typography from "@mui/material/Typography";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { PaletteMode, SxProps } from "@mui/material";

const typographyVariant = (addClassNames: string[]): GetProps<typeof Typography>["variant"] => {
    if (addClassNames.includes("NoteHead--sizeH2")) {
        return "h2";
    }
    if (addClassNames.includes("NoteHead--sizeH3")) {
        return "h3";
    }
    if (addClassNames.includes("NoteHead--sizeH4")) {
        return "h4";
    }
    if (addClassNames.includes("NoteHead--sizeH5")) {
        return "h5";
    }
    if (addClassNames.includes("NoteHead--sizeH6")) {
        return "h6";
    }
    return "h3";
};

function typographyStyle(themeMode: PaletteMode): SxProps {
    return {
        "&.NoteHead.text_empty": {
            backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
        },
        "&.NoteHead.dragZoneOk": {
            outline: `2px ${themeMode === "light" ? "black" : "white"}  dashed`,
        },
        "&.NoteHead.dragging": {
            boxShadow: "0px 6px 9px -2px black",
        },
    };
}

export { typographyVariant, typographyStyle };
