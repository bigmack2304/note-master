import React from "react";
import Typography from "@mui/material/Typography";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { SxProps } from "@mui/material";
import type { GetProps } from "0-shared/utils/typeHelpers";
import type { PaletteMode } from "@mui/material";
import { THEME_LIGHT_GRAY, THEME_DARK_GRAY } from "5-app/settings";

type TNoteHeadProps = {
    addClassNames?: string[];
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
    typographySettings?: GetProps<typeof Typography>;
};

const typographyStyle = (isChildren: boolean, themeMode: PaletteMode) => {
    return {
        cursor: "pointer",
        display: "inline-block",

        ...(isChildren
            ? {}
            : {
                  minHeight: "3rem",
                  width: "clamp(10px, 300px, 100%)",
                  backgroundColor: themeMode === "light" ? THEME_LIGHT_GRAY : THEME_DARK_GRAY,
                  borderRadius: "3px",
              }),
    } as SxProps;
};

function NoteHead({ addClassNames = [], onClick, children, typographySettings }: TNoteHeadProps) {
    const defaultClassName = "NoteHead";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const themeMode = useTemeMode();
    const isChildren = Boolean(children);

    return (
        <Typography className={genClassName} variant="h4" onClick={onClick} sx={typographyStyle(isChildren, themeMode)} {...typographySettings}>
            {children}
        </Typography>
    );
}

export { NoteHead };
