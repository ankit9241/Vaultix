import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      await login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);

      // Send the Google ID token to your backend
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Google login failed");
      }

      const data = await response.json();
      await login(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0e0e10] px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="absolute left-4 top-4 z-20 rounded-lg border border-gray-800 bg-[#111217]/90 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-amber-400/40 hover:text-amber-200 sm:left-6 sm:top-6"
      >
        Home
      </Link>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-160px] top-[-180px] h-[520px] w-[520px] rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute bottom-[-180px] right-[-140px] h-[460px] w-[460px] rounded-full bg-yellow-300/10 blur-[130px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-gray-800/90 bg-[#111217]/90 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <h2 className="mb-1 text-center text-2xl font-semibold tracking-tight text-[#f4f4f5]">
            Welcome back
          </h2>
          <p className="mb-6 text-center text-sm text-gray-400">
            Sign in to access your environment vault
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-[#0d0f14] py-3 pl-10 pr-4 text-sm text-gray-100 outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-[#0d0f14] py-3 pl-10 pr-4 text-sm text-gray-100 outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            No account?{" "}
            <Link
              to="/register"
              className="font-semibold text-amber-300 transition-colors hover:text-amber-200"
            >
              Register
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111217] px-2 text-xs tracking-[0.14em] text-gray-500">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed")}
                useOneTap
                disabled={loading}
                type="standard"
                shape="rectangular"
                theme="filled_black"
                text="signin_with"
                size="large"
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
