window.addEventListener(
    "load",
    async () => {
        if (!("serviceWorker" in navigator)) {
            alert("Ваша система не поддерживает 'service worker'. Функциональность приложения в оффлайне будет невозможна.");
            return;
        }

        try {
            const worker = new Worker(new URL("./serviceWorker.ts", import.meta.url));
            //navigator.serviceWorker.register("/0-shared/workers/serviceWorker.ts");
        } catch (e) {
            console.error(e);
        }
    },
    { once: true }
);

export {};
