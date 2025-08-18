import React from "react";
import ReactDOM from "react-dom/client";
import App from "5-app/App/App";
import { store } from "5-app/GlobalState/store";
import { Provider } from "react-redux";
import { hanleExitInit } from "0-shared/utils/handleExit";

hanleExitInit(); // функционал обрабатывающий закрытие приложения/страницы

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
