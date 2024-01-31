import React from "react";
import "./App.scss";
import "5-app/normalize/normalize.scss";
import "5-app/baseStyles/baseStyles.scss";
import { BasePage } from "4-pages/BasePage/BasePage";
import { useUiTeme } from "0-shared/hooks/useUiTeme";
import { ThemeProvider, Container } from "@mui/material";
import type { SxProps } from "@mui/material";

const containerStyles: SxProps = {};

function App() {
    const theme = useUiTeme();

    return (
        <ThemeProvider theme={theme}>
            <Container className="App" component={"div"} sx={containerStyles} maxWidth={false} disableGutters={true}>
                <BasePage></BasePage>
            </Container>
        </ThemeProvider>
    );
}

export default App;
