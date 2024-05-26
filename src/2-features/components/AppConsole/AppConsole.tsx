import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import "./AppConsole.scss";
import { useSessionStorage } from "0-shared/hooks/useSessionStorage";
import { appConsole } from "0-shared/utils/appConsole";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

/**
 * выводит содержимое логов консоли, при условии что они выведены через 0-shared/utils/appConsole.tsx
 */
function AppConsole() {
    const [sessionData, setSessionData] = useSessionStorage(true);
    const appLogs = sessionData.appLogs;
    const [inputValue, setInputValue] = useState("");
    const vieportRef = useRef<HTMLDivElement>(null);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onInputEnther = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            appConsole.user(inputValue);
            setInputValue("");
        }
    };

    const onButtonClear = () => {
        setSessionData({ ...appLogs, appLogs: [] });
    };

    useEffect(() => {
        if (vieportRef.current) {
            vieportRef.current.scrollTo({ top: vieportRef.current.scrollHeight });
        }
    });

    return (
        <div className="AppConsole">
            <div className="AppConsole__vieport" ref={vieportRef}>
                {appLogs.map((value, index) => {
                    let itemClass = `AppConsole__item`;

                    switch (value.type) {
                        case "log":
                            itemClass = itemClass.concat(" AppConsole__item--log");
                            break;
                        case "user":
                            itemClass = itemClass.concat(" AppConsole__item--user");
                            break;
                        case "warn":
                            itemClass = itemClass.concat(" AppConsole__item--warn");
                            break;
                        case "error":
                            itemClass = itemClass.concat(" AppConsole__item--error");
                            break;
                        default:
                            break;
                    }

                    return (
                        <p key={`${value}-${index}`} className={itemClass}>
                            {value.value}
                        </p>
                    );
                })}
            </div>
            <div className="AppConsole__input">
                <input type="text" value={inputValue} onChange={onInputChange} onKeyDown={onInputEnther} />
                <IconButton className="AppConsole__clearBtn" onClick={onButtonClear} title="Отчистить консоль">
                    <DeleteForeverIcon />
                </IconButton>
            </div>
        </div>
    );
}

export { AppConsole };
