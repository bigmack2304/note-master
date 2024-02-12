import React from "react";

type TColorBoxProps = {
    addClassNames?: string[];
    color?: string;
};

const colorBoxStyle = (color: string) => {
    let style: React.CSSProperties = {
        backgroundColor: color,
        border: "1px black solid",
        width: "25px",
        height: "25px",
    };

    return style;
};

/**
 * блок отображающий цвет
 * @prop color - какой цвет нужно показать
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function ColorBox({ addClassNames = [], color = "#717171" }: TColorBoxProps) {
    const defaultClassName = "ColorBox";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");

    return <div className={genClassName} style={colorBoxStyle(color)}></div>;
}

export { ColorBox };
