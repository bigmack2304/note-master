import React, { useRef, useImperativeHandle } from "react";
import { useFileReader } from "0-shared/hooks/useFileReader";
import type { Ref } from "0-shared/utils/typeHelpers";

import { inputLoadStringHandler } from "2-features/utils/inputLoadStringHandler";

type TInputFileProps = {
    inputSettings?: React.InputHTMLAttributes<HTMLInputElement>;
};

function InputFileComponent({ inputSettings }: TInputFileProps, ref: Ref<HTMLInputElement | null>) {
    const inputElement = useRef<HTMLInputElement>(null);

    const onSucc = (val: any) => {
        console.log(val);
    };

    const fileReader = useFileReader({ loadHandler: inputLoadStringHandler, loadSucessCallback: onSucc });

    useImperativeHandle(ref, () => inputElement.current!, [inputElement.current]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;

        if (!file) return;
        fileReader.readAsText(file);
    };

    return <input className="visually_hidden" type="file" accept=".txt,.json" name="file" tabIndex={-1} ref={inputElement} onChange={onInputChange} {...inputSettings}></input>;
}

const InputFile = React.forwardRef(InputFileComponent);

export { InputFile };
