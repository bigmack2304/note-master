const fs = require("fs");
const path = require("path");

// тут мы генерируем манифест для разных режимов сборки, для прод сборки у манифеста должен быть верный start_url, с учетом того что он развертывается на git pages

function genManifest(buildMode) {
    const manifest = {
        theme_color: "#6296ac",
        background_color: "#68cef3",
        icons: [
            { sizes: "512x512", src: "icon512_rounded.png", type: "image/png" },
            { sizes: "192x192", src: "icon192_rounded.png", type: "image/png" },
            { purpose: "maskable", sizes: "512x512", src: "icon512_maskable.png", type: "image/png" },
            { purpose: "maskable", sizes: "192x192", src: "icon192_maskable.png", type: "image/png" },
        ],
        screenshots: [
            {
                src: "screenshot-min.png",
                sizes: "1026x1286",
                type: "image/webp",
                form_factor: "wide",
            },
            {
                src: "screenshot-min.png",
                sizes: "1026x1286",
                type: "image/webp",
            },
        ],
        orientation: "any",
        display: "fullscreen",
        dir: "left",
        lang: "ru",
        name: "NoteMaster",
        short_name: "NoteMaster",
        description: "A one-page application for creating and structuring notes.",
        start_url: buildMode === "production" ? `/note-master/build/${process.env.GIT_BRANCH_DIR}/` : "/",
    };

    const manifestPath = path.join(__dirname, "..", "public", "manifest.json");

    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), (err) => {
        if (err) throw err;
        console.log(`manifest.json был сгенерирован в режиме '${buildMode}' и сохранен в директории ../public`);
    });
}

module.exports = genManifest;
