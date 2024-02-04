// генератор ID в виде строки из 24 символов

class IdGenerator {
  private charMap: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private cache: Set<string> = new Set();

  constructor(cache: Set<string>) {
    this.cache = cache;
  }

  public generateId(): string {
    const generator = () => {
      let result = "";
      for (let i = 0; i < 24; i++) {
        result += this.charMap.charAt(
          Math.floor(Math.random() * this.charMap.length)
        );
      }
      return result;
    };

    let newId: string;

    do {
      newId = generator();
    } while (this.cache.has(newId));

    this.cache.add(newId);
    return newId;
  }
}

export { IdGenerator };
