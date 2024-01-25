import React from "react";
import ReactDOM from "react-dom/client";
import { App, store } from "6-app";
import { Provider } from "react-redux";
import { theme } from "6-app";
import { ThemeProvider } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
