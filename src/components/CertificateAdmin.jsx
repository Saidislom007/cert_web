import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import sertifikatImg from "../assets/sertifikat.jpg";

export default function CertificateAdmin({ onLogout }) {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState("single");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [generatedFiles, setGeneratedFiles] = useState([]);
    const [error, setError] = useState("");

    // Inputlar
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");
    const [certId, setCertId] = useState("");
    const [date, setDate] = useState("");

    const [excelData, setExcelData] = useState([]);

    // 📅 Excel sanasini to‘g‘ri formatga o‘tkazish
    const formatExcelDate = (value) => {
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


    // ✅ Excel faylni o‘qish
    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);

            // ustunlarni tozalash
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

    // 🧩 Sertifikat yaratish
    const generateCertificate = async (name, course, certId, date) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = sertifikatImg;

        return new Promise((resolve) => {
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);

                // 🔠 Ism
                ctx.fillStyle = "black";
                ctx.font = "65px Arial";
                ctx.textAlign = "center";
                ctx.fillText(name, canvas.width / 2, 360);

                // 🔵 Kurs nomi
                ctx.fillStyle = "#0057A3";
                ctx.font = "40px Arial";

                if (course === "Kompyuter Savodxonligi") {
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    const cr_x = (course?.length || 0) / 2;
                    const x = canvas.height / 2 - cr_x;
                    const y = 493;
                    ctx.fillText(course || "", x, y);
                } else {
                    ctx.textAlign = "right";
                    ctx.textBaseline = "middle";
                    const len = course?.length || 0;
                    const x = canvas.width / 2 + len - 10;
                    const y = 493;
                    ctx.fillText(course || "", x, y);
                }

                // Sana
                const dateText =
                    date ||
                    new Date().toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    });
                ctx.fillStyle = "black";
                ctx.font = "28px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(dateText, 863, 739);

                // ID
                ctx.fillText(certId || "", 603, 739);

                // PDF yaratish
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [canvas.width, canvas.height],
                });

                const imgData = canvas.toDataURL("image/jpeg", 1.0);
                pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

                const pdfBlob = pdf.output("blob");
                const fileURL = URL.createObjectURL(pdfBlob);

                resolve({ name, certId, url: fileURL });
            };
        });
    };

    // 🧍 Bitta sertifikat
    const handleSingle = async () => {
        if (!name || !course || !certId) {
            alert("Barcha maydonlarni to‘ldiring!");
            return;
        }
        setLoading(true);
        const file = await generateCertificate(name, course, certId, date);
        setGeneratedFiles([file]);
        setLoading(false);
    };

    // 📊 Excel bo‘yicha
    const handleExcelGenerate = async () => {
        if (!excelData.length) {
            alert("Avval Excel fayl yuklang!");
            return;
        }

        setLoading(true);
        setGeneratedFiles([]);
        setProgress(0);

        const results = [];
        for (let i = 0; i < excelData.length; i++) {
            const row = excelData[i];
            const name = String(row.name || "").trim();
            const course = String(row.course || "").trim();
            const certId = String(row.cert_id || "").trim();
            const dateText = formatExcelDate(row.date);

            const file = await generateCertificate(name, course, certId, dateText);
            results.push(file);
            setProgress(Math.round(((i + 1) / excelData.length) * 100));
        }

        setGeneratedFiles(results);
        setLoading(false);
    };

    return (
        <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-2xl mx-auto flex flex-col gap-6">
            {/* Logout tugmasi */}
            <button
                onClick={onLogout}
                className="absolute top-4 right-4 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
                Chiqish
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-700">
                🎓 Admin Sertifikat Panel
            </h2>

            {/* Tanlov */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => setMode("single")}
                    className={`px-4 py-2 rounded-lg ${mode === "single" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    1 ta sertifikat
                </button>
                <button
                    onClick={() => setMode("excel")}
                    className={`px-4 py-2 rounded-lg ${mode === "excel" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Excel orqali
                </button>
            </div>

            {/* Bitta sertifikat formasi */}
            {mode === "single" && (
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
            )}

            {/* Excel orqali */}
            {mode === "excel" && (
                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleExcelUpload}
                        className="border p-2 rounded"
                    />
                    {error && (
                        <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>
                    )}
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
            )}

            {/* Natijalar */}
            {generatedFiles.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-lg mb-2">
                        🧾 Yaratilgan sertifikatlar:
                    </h3>
                    <ul className="flex flex-col gap-2">
                        {generatedFiles.map((file, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center border p-2 rounded"
                            >
                                <span>
                                    {file.name} — {file.certId}
                                </span>
                                <a
                                    href={file.url}
                                    download={`${file.name}_${file.certId}.pdf`}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Yuklab olish
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
}
