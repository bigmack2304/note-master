import type { PaletteMode, SxProps } from "@mui/material";

function switchStyle(theme: PaletteMode): SxProps {
    return {
        ...(theme === "dark"
            ? {
                  "& .MuiSwitch-switchBase.MuiButtonBase-root.Mui-checked .MuiSwitch-thumb": {
                      backgroundColor: "#71ca3e",
                  },
                  "& .MuiSwitch-switchBase.MuiButtonBase-root.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#71ca3e",
                  },
              }
            : {}),
    };
}

export { switchStyle };
