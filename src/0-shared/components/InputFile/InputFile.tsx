import React, { useRef, useImperativeHandle } from "react";
import { useFileReader } from "0-shared/hooks/useFileReader";
import type { Ref } from "0-shared/utils/typeHelpers";
import type { IDataSave } from "0-shared/types/dataSave";
import { inputLoadStringHandler } from "2-features/utils/inputLoadStringHandler";
import { setTempDataDB } from "2-features/utils/appIndexedDB";

type TInputFileProps = {
    inputSettings?: React.InputHTMLAttributes<HTMLInputElement>;
};

function InputFileComponent({ inputSettings }: TInputFileProps, ref: Ref<HTMLInputElement | null>) {
    const inputElement = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputElement.current!, [inputElement.current]);

    const onSucessLoad = (data: IDataSave) => {
        setTempDataDB({ value: data });
    };

    const fileReader = useFileReader<IDataSave>({ loadHandler: inputLoadStringHandler, loadSucessCallback: onSucessLoad });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;

        if (!file) return;
        fileReader.readAsText(file);
    };

    return <input className="visually_hidden" type="file" accept=".txt,.json" name="file" tabIndex={-1} ref={inputElement} onChange={onInputChange} {...inputSettings}></input>;
}

/**
 * обычный input для загрузки фаилов типа .txt или .json, имеет класс visually_hidden
 * @prop inputSettings - параметры для внутреннего htmlElement input
 * @param ref - перенаправляется на внутренний input
 */
const InputFile = React.forwardRef(InputFileComponent);

export { InputFile };
