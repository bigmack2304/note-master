import React, { useMemo, useEffect } from "react";

type TuseFileReaderParams<returnType> = {
    errorCallback?: (e: ProgressEvent<FileReader>) => void;
    abortCallback?: () => void;
    loadStartCallback?: () => void;
    loadEndCallback?: () => void;
    loadSucessCallback?: (data: returnType) => void; // вызывается после успешной обработки
    loadSucessErrCalback?: (e: unknown) => void;
    loadHandler?: (rawData: any) => returnType | Error; // функция которая будет обрабатывать считанные данные
};

/**
 * хук возвращает мемоизированный обьект fileReader.
 *
 * @prop errorCallback(e) - вызывается после loadEndCallback, если есть ошибка.
 * @prop abortCallback() - вызывается если был вызван .abort()
 * @prop loadStartCallback() - вызывается когда начался процесс чтения
 * @prop loadEndCallback() - вызывается когда чтение завершено, независимо от успеха
 * @prop loadSucessCallback(data) - вызывается когда чтение завершено c успехом,
 * @prop loadSucessErrCalback(е) - вызывается если loadHandler вернет Error
 * @prop loadHandler(raWData) - вызывается для обработки данных полученных через fileReader, должен возвращать либо обработанные данные либо Error(например если есть кастомная валидация)
 */
function useFileReader<returnType extends any>({
    errorCallback,
    abortCallback,
    loadStartCallback,
    loadEndCallback,
    loadSucessCallback,
    loadSucessErrCalback,
    loadHandler,
}: TuseFileReaderParams<returnType> = {}) {
    const fileReader = useMemo(() => new FileReader(), []);

    // вызывается после onloadend если есть ошибка
    fileReader.onerror = function (e: ProgressEvent<FileReader>) {
        console.group(`fileReader error, details ->`);
        console.error(e);
        console.groupEnd();

        errorCallback && errorCallback(e);
    };

    // если был вызван reader.abort()
    fileReader.onabort = function (e: ProgressEvent<FileReader>) {
        console.group(`fileReader aborted, details ->`);
        console.error(e);
        console.groupEnd();

        abortCallback && abortCallback();
    };

    // начат процесс чтения
    fileReader.onloadstart = function (e: ProgressEvent<FileReader>) {
        loadStartCallback && loadStartCallback();
    };

    // чтение завершено, с успехом
    fileReader.onload = function (e: ProgressEvent<FileReader>) {
        if (!e.target || !e.target.result) return;

        const rawData = e.target.result;
        let data;

        try {
            if (loadHandler) {
                let temp = loadHandler(rawData) as returnType;

                if (typeof temp === "object" && temp instanceof Error) {
                    throw new Error(temp.message);
                }

                data = temp;
            } else {
                data = rawData;
            }

            loadSucessCallback && loadSucessCallback(data as returnType);
        } catch (e) {
            console.error(e);
            loadSucessErrCalback && loadSucessErrCalback(e);
        }
    };

    // чтение завершено, независимо от успеха
    fileReader.onloadend = function (e: ProgressEvent<FileReader>) {
        loadEndCallback && loadEndCallback();
    };

    // при размантировании останавливаем reader если он читает
    useEffect(() => {
        return () => {
            if (fileReader.LOADING) fileReader.abort();
        };
    }, []);

    return fileReader;
}

export { useFileReader };
export type { TuseFileReaderParams };
