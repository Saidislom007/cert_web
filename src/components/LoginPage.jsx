import { useState } from "react";
import { Lock } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-96 border border-blue-100">
      <div className="flex flex-col items-center mb-6">
        <Lock size={48} className="text-blue-600 mb-3" />
        <h1 className="text-2xl font-bold text-blue-700">Admin Kirish</h1>
        <p className="text-gray-500 text-sm mt-1">Maxfiy parolni kiriting</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Parol"
          className="border p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Kirish
        </button>
      </form>
    </div>
  );
}
