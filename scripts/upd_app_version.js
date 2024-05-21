const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./../src/5-app/settings.ts");

fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
        console.error("Ошибка чтения файла:", err);
        return;
    }

    let isNeedUpdMinor = false;

    let updatedData = data.replace(/(APP_VERSION_PATCH\s*=\s*)(\d+)/, (match, p1, p2) => {
        const oldVersion = parseInt(p2);
        let newVersion = oldVersion + 1;

        if (newVersion > 500) {
            newVersion = 0;
            isNeedUpdMinor = true;
        }

        return `${p1}${newVersion}`;
    });

    if (isNeedUpdMinor) {
        updatedData = updatedData.replace(/(APP_VERSION_MINOR\s*=\s*)(\d+)/, (match, p1, p2) => {
            const oldVersion = parseInt(p2);
            let newVersion = oldVersion + 1;
            return `${p1}${newVersion}`;
        });
    }

    fs.writeFile(filePath, updatedData, "utf-8", (err) => {
        if (err) {
            console.error("Ошибка записи файла:", err);
            return;
        }
        console.log("Файл успешно обновлен.");
    });
});
