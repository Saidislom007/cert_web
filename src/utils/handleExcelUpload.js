import * as XLSX from "xlsx";

export const handleExcelUpload = (file, setExcelData, setError) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const cleanedRows = rows.map((row) => {
            const newRow = {};
            for (const key in row) {
                const newKey = key
                    .toString()
                    .trim()
                    .replace(/\s+/g, ".")
                    .toLowerCase();
                newRow[newKey] = row[key];
            }
            return newRow;
        });

        const allColumns = Object.keys(cleanedRows[0] || {});
        const expected = ["name", "course", "cert_id", "date"];
        const missing = expected.filter((col) => !allColumns.includes(col));

        if (missing.length > 0) {
            setError(
                `❌ Faylda kerakli ustunlar yo‘q!\nAniqlangan: ${allColumns.join(
                    ", "
                )}\nKeraklilar: Name | Course | Cert_ID | Date`
            );
            setExcelData([]);
            return;
        }

        setError("");
        setExcelData(cleanedRows);
    };
    reader.readAsArrayBuffer(file);
};
