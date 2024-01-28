import React from "react";
import "./App.scss";
import { BasePage } from "4-pages";
import { useUiTeme } from "0-shared";
import { ThemeProvider } from "@mui/material";

function App() {
    const theme = useUiTeme();

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <BasePage></BasePage>
            </div>
        </ThemeProvider>
    );
}

export default App;
