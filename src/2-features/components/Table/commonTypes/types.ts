type TActiveCellData = {
    bodyRow: number; // индекс строки клеточки с содержимым в неформатированном массиве
    bodyColumn: number; // индекс колонки клеточки с содержимым в неформатированном массиве
    headerColumn: number; // индекс клеточки заголовка в неформатированном массиве
    inputDubleCellValue: React.MutableRefObject<HTMLInputElement | undefined>; // реф на элемент ввода текста, дублирующий клеточку
    targetActiveCell: React.MutableRefObject<HTMLTextAreaElement | undefined>; // реф на активную клеточку
};

export type { TActiveCellData };
