import React, { useEffect } from "react";
import "./App.scss";
import "5-app/normalize/normalize.scss";
import "5-app/baseStyles/baseStyles.scss";
import { BasePage } from "4-pages/BasePage/BasePage";
import { useUiTeme } from "0-shared/hooks/useUiTeme";
import { ThemeProvider, Container, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useAppUiInfo } from "0-shared/hooks/useAppUiInfo";
import { register, unregister } from "registerServiceWorker";
import { workerRegister } from "0-shared/dedicatedWorker/workerInit";

/**
 * базовый кормпонент, инициализация приложения
 */
function App() {
    const theme = useUiTeme();
    useAppUiInfo();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={4} autoHideDuration={1800} className="Snackbar__snack">
                <Container className="App" component={"div"} maxWidth={false} disableGutters={true}>
                    <BasePage></BasePage>
                </Container>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

//register(); // регистрация сервис воркера
unregister(); //TODO: незабыть это удалить в конце этой ветки (worker)
workerRegister(true); // регистрация dedicated воркера

export default App;
