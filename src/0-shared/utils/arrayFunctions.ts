/**
 * сдвигает все элементы массива та кчтобы fromIndex оказался на позиции toIndex, при этом остальные элементы сдвигаются заполняя освободившееся место
 * @param arr - массив элементов
 * @param fromIndex - индекс который нукжно переместить
 * @param toIndex - индекс куда нужно переменстить fromIndex
 * @returns новый массив
 */
function moveElement(arr: any[], fromIndex: number, toIndex: number): any[] {
    let copyArr = [...arr];
    const temp = copyArr[fromIndex];

    if (fromIndex < toIndex) {
        for (let i = fromIndex; i < toIndex; i++) {
            copyArr[i] = copyArr[i + 1];
        }
    } else {
        for (let i = fromIndex; i > toIndex; i--) {
            copyArr[i] = copyArr[i - 1];
        }
    }

    copyArr[toIndex] = temp;
    return copyArr;
}

export { moveElement };
