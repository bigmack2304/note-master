import React, { ForwardRefRenderFunction } from "react";
import type { Ref, GetProps } from "0-shared/utils/typeHelpers";

type TInputFileProps = {
    inputSettings?: React.InputHTMLAttributes<HTMLInputElement>;
};

function InputFileComponent({ inputSettings }: TInputFileProps, ref: Ref<HTMLInputElement>) {
    return <input className="visually_hidden" type="file" accept=".txt,.json" name="file" tabIndex={-1} ref={ref} {...inputSettings}></input>;
}

const InputFile = React.forwardRef(InputFileComponent);

export { InputFile };
