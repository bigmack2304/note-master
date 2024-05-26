/**
 * функционал будет связан с закрытием приложения
 * - нужно вызвать всего один раз при инициализации приложения
 */
function hanleExitInit() {
    window.addEventListener(
        "load",
        () => {
            window.addEventListener("beforeunload", (EUnload: Event) => {
                EUnload.preventDefault();
                EUnload.returnValue = false;
            });
        },
        { once: true }
    );
}

export { hanleExitInit };
