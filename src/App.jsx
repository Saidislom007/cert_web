import { useState, useEffect } from "react";
import CertificateAdmin from "./components/CertificateAdmin";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "authorized") setIsLoggedIn(true);
  }, []);

  const handleLogin = (password) => {
    if (password === "Six monkeys are looking up to the sky") {
      localStorage.setItem("admin_token", "authorized");
      setIsLoggedIn(true);
    } else {
      alert("❌ Noto‘g‘ri parol!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <CertificateAdmin onLogout={handleLogout} />
      )}
    </div>
  );
}
