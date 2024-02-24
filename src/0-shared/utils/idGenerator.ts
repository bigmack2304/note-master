// генератор ID в виде строки из 16 символов

/**
 * класс для генерации уникальных ID, используется для генерации уникальных идентификаторов для DataTemp в indexed db
 * @constructor_Param cache - Set(string) обьект с данными который будет использоватся в качестве кеша со всеми id
 */
class IdGenerator {
    static _charMap: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private _cache: Set<string> = new Set();

    constructor(cache: Set<string>) {
        this._cache = cache;
    }

    public generateId(): string {
        const generator = () => {
            let result = "";
            for (let i = 0; i < 16; i++) {
                result += IdGenerator._charMap.charAt(Math.floor(Math.random() * IdGenerator._charMap.length));
            }
            return result;
        };

        let newId: string;

        do {
            newId = generator();
        } while (this._cache.has(newId));

        this._cache.add(newId);
        //console.log(this.getIdsArray());
        return newId;
    }

    public deleteId(id: string) {
        if (this._cache.has(id)) {
            this._cache.delete(id);
            //console.log(this.getIdsArray());
        }
    }

    public getIdsArray() {
        return Array.from(this._cache);
    }
}

type TSavedIdGenerator = {
    instatnceIdGenerator: IdGenerator | undefined;
};

/**
 * эту конструкцию будем использовать для сохранения экземпляра класса IdGenerator
 * и передачи ее в разные участки кода
 * @ изменение своиства instatnceIdGenerator будет приводить к событию appIdGeneratorNewInstance на window
 */
const savedIdGenerator: TSavedIdGenerator = new Proxy(
    {
        instatnceIdGenerator: undefined,
    },
    {
        set(target, prop, newValue, receiver) {
            if (prop === "instatnceIdGenerator") {
                window.dispatchEvent(new CustomEvent("appIdGeneratorNewInstance"));
            }
            return Reflect.set(target, prop, newValue, receiver);
        },
    }
);

export { IdGenerator, savedIdGenerator };
