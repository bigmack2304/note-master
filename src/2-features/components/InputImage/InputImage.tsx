import React, { useRef, useImperativeHandle, useState } from "react";
import { useFileReader } from "0-shared/hooks/useFileReader";
import type { Ref } from "0-shared/utils/typeHelpers";

type TInputImageProps = {
    inputSettings?: React.InputHTMLAttributes<HTMLInputElement>;
    loadCallback?: (data: string, filename: string) => void;
};

function InputImage_component({ inputSettings, loadCallback }: TInputImageProps, ref: Ref<HTMLInputElement | null>) {
    const inputElement = useRef<HTMLInputElement>(null);
    const [filename, setFileName] = useState<string>("");
    useImperativeHandle(ref, () => inputElement.current!, [inputElement.current]);

    const onSucessLoad = (data: string) => {
        loadCallback && loadCallback(data, filename);

        if (inputElement.current) inputElement.current.value = "";
        setFileName("");
    };

    const fileReader = useFileReader<string>({ loadSucessCallback: onSucessLoad });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;
        if (!file) return;
        setFileName(file.name);
        fileReader.readAsDataURL(file);
    };

    return (
        <input
            className="visually_hidden"
            type="file"
            accept=".jpeg,.jpg,.png,.bmp"
            name="file"
            tabIndex={-1}
            ref={inputElement}
            onChange={onInputChange}
            {...inputSettings}
        ></input>
    );
}

/**
 * обычный input для загрузки картинок, имеет класс visually_hidden
 * @prop inputSettings - параметры для внутреннего htmlElement input
 * @prop loadCallback - вызывается после загрузки и считывания данных, аргументом получает DataURL
 * @param ref - перенаправляется на внутренний input
 */
const InputImage = React.forwardRef(InputImage_component);

export { InputImage };
