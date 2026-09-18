import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ClipboardCheck } from "lucide-react";

const users = [
  { email: "admin@cornortech.com", password: "admin123", role: "admin" },
  { email: "employee@cornortech.com", password: "emp123", role: "employee" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    const foundUser = users.find((u) => u.email === email.trim());

    if (!foundUser) {
      setError("User not found");
      return;
    }

    if (foundUser.password !== password) {
      setError("Invalid credentials");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      localStorage.setItem("cornor_ems_auth", "true");

      if (foundUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0FC] font-[Poppins] px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#9333EA] flex items-center justify-center shadow-md shadow-purple-200 mb-3">
              <ClipboardCheck size={28} color="#ffffff" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Task<span className="text-[#9333EA]">Flow</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="admin@cornortech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="accent-[#9333EA]" /> Remember me
              </label>
              <a href="#" className="text-[#9333EA] hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9333EA] hover:bg-[#7E22CE] disabled:opacity-70 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? "Verifying credentials..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}