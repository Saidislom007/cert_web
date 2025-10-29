export default function CertificateFormSingle({
    name,
    course,
    certId,
    date,
    setName,
    setCourse,
    setCertId,
    setDate,
    handleSingle,
    loading,
}) {
    return (
        <div className="flex flex-col gap-3">
            <input
                type="text"
                placeholder="Ism Familiya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="Kurs nomi"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="ID"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="Sana (ixtiyoriy)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded"
            />

            <button
                disabled={loading}
                onClick={handleSingle}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                {loading ? "⏳ Yaratilmoqda..." : "📜 Sertifikat yaratish"}
            </button>
        </div>
    );
}
