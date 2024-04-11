// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (e) => {
    console.log("serviceWorker: install");
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", () => {
    console.log("serviceWorker: active");
});

console.log(123);
