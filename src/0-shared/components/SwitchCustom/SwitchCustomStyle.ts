import type { PaletteMode, SxProps } from "@mui/material";
import { CONTROLS_PRIMARY_DARK } from "5-app/settings";

function switchStyle(theme: PaletteMode): SxProps {
    return {
        ...(theme === "dark"
            ? {
                  "& .MuiSwitch-switchBase.MuiButtonBase-root.Mui-checked .MuiSwitch-thumb": {
                      backgroundColor: CONTROLS_PRIMARY_DARK,
                  },
                  "& .MuiSwitch-switchBase.MuiButtonBase-root.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: CONTROLS_PRIMARY_DARK,
                  },
              }
            : {}),
    };
}

export { switchStyle };
