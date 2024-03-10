type TContentType = { li: string[] };

// обрабатываем JSON содержимое
function prepareChildren(children: string | undefined) {
    try {
        if (!children) throw new Error("Children = undefined");
        let prepare = JSON.parse(children) as TContentType;

        if (!("li" in prepare)) throw new Error("Children not valid");
        if (!Array.isArray(prepare.li)) throw new Error("Children not valid");
        if (prepare.li.length === 0) return [];

        return prepare.li;
    } catch (e) {
        return [];
    }
}

export { prepareChildren };
export type { TContentType };
