import { TAGS_COLORS_LIGHT, CONTROLS_PRIMARY_LIGHT, CONTROLS_PRIMARY_DARK } from "5-app/settings";
import type { IGlobalTag } from "0-shared/types/dataSave";
import type { PaletteMode, SxProps } from "@mui/material";

function addTagSelectStyle(tag: IGlobalTag, isColored: boolean, theme: PaletteMode): SxProps {
    let colorMix = theme === "light" ? "#FFFFFF0F" : "#00000030";
    let colorMixSelect = theme === "light" ? "##d4d4d4" : "#0000007B";
    let colorOpacyty = theme === "light" ? "40%" : "60%";

    return {
        "&.AddTagSelect__item": {
            ...(isColored
                ? {
                      backgroundColor: `color-mix(in srgb-linear, ${TAGS_COLORS_LIGHT[tag.color]}, ${colorMix} ${colorOpacyty})`,

                      "&:hover": {
                          backgroundColor: `color-mix(in srgb-linear, ${TAGS_COLORS_LIGHT[tag.color]}, ${colorMix} ${colorOpacyty})`,
                          outline: `2px ${theme === "light" ? "black" : "white"} dashed`,
                      },
                      "&.Mui-selected": {
                          backgroundColor: `color-mix(in srgb-linear, ${TAGS_COLORS_LIGHT[tag.color]}, ${colorMixSelect} ${colorOpacyty})`,
                          "box-shadow": `inset 0px 0px 0px 2px ${theme === "light" ? CONTROLS_PRIMARY_LIGHT : CONTROLS_PRIMARY_DARK}`,
                          margin: "3px 3px",
                      },
                      "&.Mui-selected:hover": {
                          backgroundColor: `color-mix(in srgb-linear, ${TAGS_COLORS_LIGHT[tag.color]}, ${colorMixSelect} ${colorOpacyty})`,
                          margin: "3px 3px",
                      },
                  }
                : {}),
        },
    };
}

export { addTagSelectStyle };
