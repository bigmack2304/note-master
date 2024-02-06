import React, { useEffect } from "react";
import { savedIdGenerator } from "0-shared/utils/idGenerator";
import { useHandleUpdate } from "./useHandleUpdate";

type TIdGeneratorParams = {
    isUpdOnNewInstance?: boolean;
};

/**
 * возвращает экземпляр класса IdGenerator
 * @prop isUpdOnNewInstance - boolean, будетли происходить ререндер
 */
function useIdGenerator({ isUpdOnNewInstance = false }: TIdGeneratorParams = {}) {
    const instance = savedIdGenerator.instatnceIdGenerator;
    const [update] = useHandleUpdate();

    useEffect(() => {
        if (isUpdOnNewInstance) {
            window.addEventListener("appIdGeneratorNewInstance", update);
        }
        return () => {
            if (isUpdOnNewInstance) {
                window.removeEventListener("appIdGeneratorNewInstance", update);
            }
        };
    }, []);

    return instance;
}

export { useIdGenerator };
