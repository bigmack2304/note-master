import React, { useEffect } from "react";
import "./App.scss";
import "5-app/normalize/normalize.scss";
import "5-app/baseStyles/baseStyles.scss";
import { BasePage } from "4-pages/BasePage/BasePage";
import { useUiTeme } from "0-shared/hooks/useUiTeme";
import { ThemeProvider, Container, CssBaseline } from "@mui/material";

/**
 * базовый кормпонент, инициализация приложения
 */
function App() {
    const theme = useUiTeme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container className="App" component={"div"} maxWidth={false} disableGutters={true}>
                <BasePage></BasePage>
            </Container>
        </ThemeProvider>
    );
}

export default App;
