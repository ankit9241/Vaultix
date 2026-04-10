import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    login,
    setSkipValidation,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const data = await authService.register(email, password);
      await login(data.token);
      setSkipValidation(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Register failed");
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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-6">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-primary/10 blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] bottom-[-100px] right-[-100px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-textMuted">Start your vault</p>
        </div>

        <div className="bg-panel p-8 rounded-xl border border-border shadow-xl backdrop-blur-sm">
          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3 text-textMuted"
              />
              <input
                type="email"
                required
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-code border border-border rounded-lg py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3 text-textMuted"
              />
              <input
                type="password"
                required
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-code border border-border rounded-lg py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3 text-textMuted"
              />
              <input
                type="password"
                required
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-code border border-border rounded-lg py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-panel text-textMuted">
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

          <div className="mt-6 text-center text-sm text-textMuted">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
