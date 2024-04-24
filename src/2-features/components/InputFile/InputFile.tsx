import React, { useRef, useImperativeHandle } from "react";
import { useFileReader } from "0-shared/hooks/useFileReader";
import { inputLoadStringHandler } from "2-features/utils/inputLoadStringHandler";
import { setAllTempDataDB } from "2-features/utils/appIndexedDB";
import { IdGenerator, savedIdGenerator } from "0-shared/utils/idGenerator";
import { getAllIds } from "2-features/utils/saveDataParse";
import { setIsOpen } from "5-app/GlobalState/leftMenuStore";
import { useAppDispatch } from "0-shared/hooks/useAppDispatch";
import { setProjectOpen, setCurrentFolder, setCurrentNote } from "5-app/GlobalState/saveDataInspectStore";
import type { Ref } from "0-shared/utils/typeHelpers";
import type { IDataSave } from "0-shared/types/dataSave";

type TInputFileProps = {
    inputSettings?: React.InputHTMLAttributes<HTMLInputElement>;
};

function InputFileComponent({ inputSettings }: TInputFileProps, ref: Ref<HTMLInputElement | null>) {
    const dispatch = useAppDispatch();
    const inputElement = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputElement.current!, [inputElement.current]);

    const onSucessLoad = (data: IDataSave) => {
        savedIdGenerator.instatnceIdGenerator = new IdGenerator(getAllIds(data));
        dispatch(setProjectOpen(true));
        dispatch(setCurrentFolder(undefined));
        dispatch(setCurrentNote(undefined));
        setAllTempDataDB({ value: data });

        if (inputElement.current) inputElement.current.value = "";
    };

    const fileReader = useFileReader<IDataSave>({ loadHandler: inputLoadStringHandler, loadSucessCallback: onSucessLoad });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;
        dispatch(setIsOpen({ isOpen: false }));
        if (!file) return;
        fileReader.readAsText(file);
    };

    return (
        <input
            className="visually_hidden"
            type="file"
            accept=".txt,.json"
            name="file"
            tabIndex={-1}
            ref={inputElement}
            onChange={onInputChange}
            {...inputSettings}
        ></input>
    );
}

/**
 * обычный input для загрузки фаилов типа .txt или .json, имеет класс visually_hidden
 * @prop inputSettings - параметры для внутреннего htmlElement input
 * @param ref - перенаправляется на внутренний input
 */
const InputFile = React.forwardRef(InputFileComponent);

export { InputFile };
