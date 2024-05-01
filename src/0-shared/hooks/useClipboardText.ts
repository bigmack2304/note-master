import React from "react";

type TUseClipboardTextProps = {
    onReadCallback?: (value: string) => void;
    onWriteCallback?: () => void;
};

/**
 * хук позволяет записывать данные в буфер обмена или считывать их оттуда
 * @prop onReadCallback(readedValue) - срабатывает после успешного считывания через clipboardReadText
 * @prop onReadCallback - срабатывает после шной записи через clipboardWriteText
 * @returns [clipboardReadText - читает текст, clipboardWriteText - записывает текст]
 */
function useClipboardText({ onReadCallback, onWriteCallback }: TUseClipboardTextProps = {}): [clipboardReadText: () => void, clipboardWriteText: (str: string) => void] {
    const clipboardReadText = () => {
        const clipboard = navigator.clipboard.readText();
        clipboard.then((result) => {
            onReadCallback && onReadCallback(result);
        });
        clipboard.catch((e) => {
            console.error(e);
        });
    };

    const clipboardWriteText = (str: string) => {
        const clipboard = navigator.clipboard.writeText(str);
        clipboard.then((result) => {
            onWriteCallback && onWriteCallback();
        });
        clipboard.catch((e) => {
            console.error(e);
        });
    };

    return [clipboardReadText, clipboardWriteText];
}

export { useClipboardText };
