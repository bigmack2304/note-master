import React, { useRef, useImperativeHandle } from "react";
import { Box } from "@mui/material";
import "./style.scss";
import * as styles from "./NoteFaceComponentStyle";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import type { Ref } from "0-shared/utils/typeHelpers";

type NoteFaceComponentProps = {
    beforeName?: string;
};

/**
 * пустой компонент заглушка
 *
 * @prop beforeName - имя компонента
 */
function NoteFaceComponentComponent({ beforeName }: NoteFaceComponentProps, ref: Ref<HTMLDivElement | null>) {
    const divElement = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => divElement.current!, [divElement.current]);
    const themeValue = useTemeMode();

    return <Box className="NoteFaceComponent" ref={divElement} sx={styles.noteFaceComponentStyle(themeValue, beforeName)}></Box>;
}

const NoteFaceComponent = React.forwardRef(NoteFaceComponentComponent);

export { NoteFaceComponent };
