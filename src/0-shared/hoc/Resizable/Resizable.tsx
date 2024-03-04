import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import { GetProps } from "0-shared/utils/typeHelpers";
import { Box } from "@mui/material";
import { useEventListener } from "0-shared/hooks/useEventListener";
import { resizableStyle, resizableControllerStyle } from "./ResizableStyle";
import { stringAddClass, stringRemoveClass } from "0-shared/utils/stringFuncs";
import { useTemeMode } from "0-shared/hooks/useThemeMode";
import { firstCallerDelayCallback } from "0-shared/utils/decorators";
import type { ComponentType } from "react";
import "./style.scss";

interface IResizableProps<W extends {} = {}> {
    WrappedComponent: ComponentType<W>;
    wrappedProps?: W;
    children?: GetProps<W> extends { children: infer C } ? C : undefined;
    minSize?: number;
    startSize?: number;
    disabled?: boolean;
    onResize?: (newSize: number) => void;
    optimizeMount?: boolean;
    close?: boolean;
    addClassNames?: string[];
}

/**
 * компонент обертка, позволяет изменять размер элемента по оси X по правой стороне
 *
 * @prop WrappedComponent - функциональный компонент который нужно обернуть
 * @prop wrappedProps - пропсы для оборачеваемого компонента
 * @prop children - дочерние элементы которые применятся к оборачиваемому компоненту
 * @prop minSize - минимальный размер окна
 * @prop startSize - стартовый размер окна
 * @prop disabled - если true то ресайз заблокирован
 * @prop onResize(newWidth) - вызывается после применения новых настроек ширины
 * @prop optimizeMount - если true то при (размере окна) < minSize + 10px внутреннее содержимое будет размонтировано
 * @prop close - если true то окно будет минимально возможного размера и в состоянии disabled
 * @prop addClassNames - массив строк, которые будут применены к компоненту в качестве доп.классов
 */
function Resizable<WrappedProps extends {}>({
    WrappedComponent,
    wrappedProps = {} as WrappedProps,
    children,
    minSize = 7,
    startSize = 250,
    disabled = false,
    optimizeMount = false,
    close = false,
    addClassNames = [],
    onResize,
}: IResizableProps<WrappedProps>) {
    const defaultClassName = "Resizable";
    const genClassName = defaultClassName.split(" ").concat(addClassNames).join(" ");
    const [wrapperWidth, setWrapperWidth] = useState<number>(startSize);
    const isContrlollerDown = useRef<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null); // обязательно ref чтобы в EventListener попадали актуальные данные
    const ghostRef = useRef<HTMLDivElement>(null);
    const themeValue = useTemeMode();
    const mouseX = useRef<number>(startSize); // храним положение курсора, ref чтобы небыло лишних перерендеров
    const isDisabled = useRef<boolean>(disabled); // обязательно ref чтобы в EventListener попадали актуальные данные
    const isClose = useRef<boolean>(close); // обязательно ref чтобы в EventListener попадали актуальные данные
    const [resizableControllerClass, setResizableControllerClass] = useState<string>(
        isDisabled.current ? "Resizable__controller Resizable__controller--disabled" : "Resizable__controller"
    ); // класс для ресайз-контроллера

    // нажатие на ресайзер
    const onControllerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isDisabled.current) return;
        isContrlollerDown.current = true;
        setResizableControllerClass((oldState) => stringAddClass(oldState, "Resizable__controller--selected"));
    };

    // изменяем позицию Resizable__ghost
    const setGhostLeft = (offsetLeft: number) => {
        if (ghostRef.current) {
            ghostRef.current.style.left = `${offsetLeft}px`;
        }
    };

    // движение ресайзера
    useEventListener({
        eventName: "pointermove",
        onEvent: (e: PointerEvent) => {
            //TODO: при изменении размера нужно обновлять положение ресайза, чтобы он не вышел за экран
            if (!isContrlollerDown.current) return;

            if (e.clientX > window.innerWidth / 2) {
                mouseX.current = window.innerWidth / 2;
                setGhostLeft(mouseX.current);
                return;
            }
            if (e.clientX < minSize) {
                mouseX.current = minSize;
                setGhostLeft(mouseX.current);
                return;
            }

            mouseX.current = e.clientX;
            setGhostLeft(mouseX.current);
        },
    });

    // отпускание ресайзера
    useEventListener({
        eventName: "pointerup",
        onEvent: () => {
            if (isDisabled.current) return;
            isContrlollerDown.current = false;
            setWrapperWidth(mouseX.current);

            setResizableControllerClass((oldState) => stringRemoveClass(oldState, "Resizable__controller--selected"));
        },
    });

    // изменение размера окна браузера
    useEventListener({
        eventName: "resize",
        onEvent: firstCallerDelayCallback({
            func: () => {
                if (Math.ceil(mouseX.current) > window.innerWidth / 2) {
                    mouseX.current = window.innerWidth / 2;
                    setWrapperWidth(mouseX.current);
                }
            },
            delay: 200,
        }),
    });

    // отменяем размер при изменении стейта,
    // PS: useLayoutEffect чтобы визуально компонент появлялся сразу в нужном положении, иначе он отрендерится на 0 координатах а потом перескочит на wrapperWidth
    useLayoutEffect(() => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.width = `${wrapperWidth}px`;
        onResize && onResize(wrapperWidth);
    }, [wrapperWidth]);

    // костыль для корректной работы disabled, EventListener-ы корректно видят только рефы
    useEffect(() => {
        isDisabled.current = disabled;
        if (disabled) {
            setResizableControllerClass((oldState) => stringAddClass(oldState, "Resizable__controller--disabled"));
        } else {
            setResizableControllerClass((oldState) => stringRemoveClass(oldState, "Resizable__controller--disabled"));
        }
    }, [disabled]);

    // костыль для корректной работы close, EventListener-ы корректно видят только рефы
    useEffect(() => {
        isClose.current = close;

        if (close) {
            if (!isDisabled.current) {
                isDisabled.current = true;
                setResizableControllerClass((oldState) => stringAddClass(oldState, "Resizable__controller--disabled"));
                if (!wrapperRef.current) return;
                wrapperRef.current.style.width = `${minSize}px`;
            }
        } else {
            if (!disabled) {
                isDisabled.current = false;
                setResizableControllerClass((oldState) => stringRemoveClass(oldState, "Resizable__controller--disabled"));
                if (!wrapperRef.current) return;
                wrapperRef.current.style.width = `${wrapperWidth}px`;
            }
        }
    }, [close, isDisabled.current, disabled]);

    // логика для рендера оборачиваемого компонента
    const renderWrapped = () => {
        if (optimizeMount) {
            if (wrapperWidth >= minSize + 10) {
                return <WrappedComponent {...wrappedProps}>{children}</WrappedComponent>;
            } else {
                return null;
            }
        }

        return <WrappedComponent {...wrappedProps}>{children}</WrappedComponent>;
    };

    return (
        <Box component={"div"} className={genClassName} sx={resizableStyle(minSize)} ref={wrapperRef}>
            <Box className={"Resizable__contentSlot"}>{renderWrapped()}</Box>
            <Box className={resizableControllerClass} sx={resizableControllerStyle(themeValue)} onPointerDown={onControllerDown}></Box>
            {isContrlollerDown.current && <Box className="Resizable__ghost" ref={ghostRef}></Box>}
        </Box>
    );
}

export { Resizable };
