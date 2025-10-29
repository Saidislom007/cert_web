import { useRef, useState } from "react";
import { formatExcelDate } from "../utils/formatExcelDate";
import { handleExcelUpload } from "../utils/handleExcelUpload";
import { generateCertificate } from "../utils/generateCertificate";
import CertificateFormSingle from "./CertificateFormSingle";
import CertificateFormExcel from "./CertificateFormExcel";
import CertificateList from "./CertificateList";
import exampleExcel from "../assets/example_excel.png";

// 🔹 Lucide iconlar
import {
    LogOut,
    Eye,
    EyeOff,
    FileSpreadsheet,
    Award,
} from "lucide-react";

export default function CertificateAdmin({ onLogout }) {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState("single");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [generatedFiles, setGeneratedFiles] = useState([]);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");
    const [certId, setCertId] = useState("");
    const [date, setDate] = useState("");
    const [excelData, setExcelData] = useState([]);
    const [showExample, setShowExample] = useState(false);

    const handleSingle = async () => {
        if (!name || !course || !certId) {
            alert("Barcha maydonlarni to‘ldiring!");
            return;
        }
        setLoading(true);
        const file = await generateCertificate(canvasRef, name, course, certId, date);
        setGeneratedFiles([file]);
        setLoading(false);
    };

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

            const file = await generateCertificate(canvasRef, name, course, certId, dateText);
            results.push(file);
            setProgress(Math.round(((i + 1) / excelData.length) * 100));
        }

        setGeneratedFiles(results);
        setLoading(false);
    };

    return (
        <div className="bg-white shadow-2xl p-6 sm:p-8 rounded-2xl w-full max-w-3xl mx-auto flex flex-col gap-6 relative min-h-screen">
            {/* 🔴 Logout button */}
            <button
                onClick={onLogout}
                className="absolute top-4 right-4 flex items-center gap-1 text-sm bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Chiqish</span>
            </button>

            {/* 🏷️ Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-700 flex items-center justify-center gap-2 mt-10 sm:mt-0">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                Admin Sertifikat Panel
            </h2>

            {/* 🔘 Rejim tanlash */}
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={() => setMode("single")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                        mode === "single"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                    <Award className="w-4 h-4" />
                    1 ta sertifikat
                </button>
                <button
                    onClick={() => setMode("excel")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                        mode === "excel"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel orqali
                </button>
            </div>

            {/* 🧾 Form rejimlari */}
            {mode === "single" && (
                <CertificateFormSingle
                    name={name}
                    course={course}
                    certId={certId}
                    date={date}
                    setName={setName}
                    setCourse={setCourse}
                    setCertId={setCertId}
                    setDate={setDate}
                    handleSingle={handleSingle}
                    loading={loading}
                />
            )}

            {mode === "excel" && (
                <div className="flex flex-col gap-4">
                    <CertificateFormExcel
                        handleExcelUpload={(file) =>
                            handleExcelUpload(file, setExcelData, setError)
                        }
                        excelData={excelData}
                        error={error}
                        loading={loading}
                        progress={progress}
                        handleExcelGenerate={handleExcelGenerate}
                    />

                    {/* 📄 Excel namunasi ko‘rsatish */}
                    <button
                        onClick={() => setShowExample(!showExample)}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-md py-2 text-sm sm:text-base font-medium transition"
                    >
                        {showExample ? (
                            <>
                                <EyeOff className="w-4 h-4" /> Namunani yashirish
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" /> Excel namunani ko‘rish
                            </>
                        )}
                    </button>

                    {showExample && (
                        <div className="border rounded-lg p-2 bg-gray-50 flex justify-center">
                            <img
                                src={exampleExcel}
                                alt="Excel namunasi"
                                className="rounded-lg max-h-96 w-full object-contain"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* 📦 Hosil bo‘lgan fayllar */}
            {generatedFiles.length > 0 && (
                <CertificateList generatedFiles={generatedFiles} />
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
}
