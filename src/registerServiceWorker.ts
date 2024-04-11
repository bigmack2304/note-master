export function register() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            const buildMode = process.env.NODE_ENV;
            navigator.serviceWorker
                .register(buildMode === "development" ? "./service-worker.js" : "./note-master/build/dev/service-worker.js")
                .then((registration) => {
                    console.log("SW registered: ", registration);
                })
                .catch((registrationError) => {
                    console.log("SW registration failed: ", registrationError);
                });
        });
    }
}

export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.unregister();
        });
    }
}
