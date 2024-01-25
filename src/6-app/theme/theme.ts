import { createTheme } from "@mui/material/styles";

// Augment the palette to include a new color
declare module "@mui/material/styles" {
    interface Palette {
        bluWhite: Palette["primary"];
    }

    interface PaletteOptions {
        bluWhite?: PaletteOptions["primary"];
    }
}

// Update the Button's color options to include a new option
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        bluWhite: true;
    }
}

let theme = createTheme({});

theme = createTheme(theme, {
    palette: {
        bluWhite: theme.palette.augmentColor({
            color: {
                main: "#e0f7fa",
            },
            name: "bluWhite",
        }),
        // mode: "dark",
    },
});

export { theme };
