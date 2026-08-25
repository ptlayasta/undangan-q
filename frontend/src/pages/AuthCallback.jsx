import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const params = new URLSearchParams(location.search || "");
    const code = params.get("code");
    if (!code) {
      navigate("/", { replace: true });
      return;
    }
    (async () => {
      try {
        const redirectUri = window.location.origin + "/auth/callback";
        const { data } = await apiClient.post("/auth/google", { code, redirect_uri: redirectUri });
        setUser(data.user);
        navigate("/dashboard", { replace: true, state: { user: data.user } });
      } catch (e) {
        navigate("/", { replace: true });
      }
    })();
  }, [location.search, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f8f6]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#c05c46] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-neutral-500 font-body">Menghubungkan akun...</p>
      </div>
    </div>
  );
}
