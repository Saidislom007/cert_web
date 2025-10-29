import { useState } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🔐 Login jarayonini simulyatsiya qilamiz
    await new Promise((r) => setTimeout(r, 800));

    if (!password) {
      setError("Parol kiritilmadi!");
      setLoading(false);
      return;
    }

    const success = onLogin(password); // tashqaridagi login funksiyasini chaqiradi

    if (!success) {
      setError("❌ Noto‘g‘ri parol. Qayta urinib ko‘ring.");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm border border-blue-100 transition-all">
        {/* 🔒 Logo va sarlavha */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <Lock size={36} className="text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700">Admin Kirish</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Tizimga kirish uchun maxfiy parolni kiriting
          </p>
        </div>

        {/* 🔹 Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Parol"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-white transition
              ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Yuklanmoqda...
              </>
            ) : (
              "Kirish"
            )}
          </button>
        </form>

        {/* 🔹 Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Sertifikat Admin Panel
        </p>
      </div>
    </div>
  );
}
