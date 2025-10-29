export const formatExcelDate = (value) => {
    if (!value) return "";
    if (!isNaN(value)) {
        const baseDate = new Date(1899, 11, 30);
        const resultDate = new Date(baseDate.getTime() + value * 86400000);
        const day = String(resultDate.getDate()).padStart(2, "0");
        const month = String(resultDate.getMonth() + 1).padStart(2, "0");
        const year = resultDate.getFullYear();
        return `${year}.${month}.${day}`;
    }
    try {
        const d = new Date(value);
        if (!isNaN(d)) {
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}.${month}.${year}`;
        }
    } catch { }
    return String(value).replace(/[-/]/g, ".");
};
