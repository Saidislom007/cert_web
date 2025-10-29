export default function CertificateFormExcel({
    handleExcelUpload,
    excelData,
    error,
    loading,
    progress,
    handleExcelGenerate,
}) {
    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                accept=".xlsx"
                onChange={(e) => handleExcelUpload(e.target.files[0])}
                className="border p-2 rounded"
            />
            {error && <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>}
            {excelData.length > 0 && (
                <p className="text-green-600 font-medium">
                    {excelData.length} ta qatordan ma’lumot topildi ✅
                </p>
            )}

            {loading && (
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-blue-600 h-4 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}

            <button
                disabled={loading}
                onClick={handleExcelGenerate}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                {loading ? `⏳ ${progress}%...` : "📄 Excel bo‘yicha yaratish"}
            </button>
        </div>
    );
}
