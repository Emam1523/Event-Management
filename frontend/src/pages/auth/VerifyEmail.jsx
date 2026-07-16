import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiMail,
  FiShield,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../../services/api";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const { setUser } = useAuth();

  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "registration";
  const next = searchParams.get("next") || "/profile";

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const title = useMemo(() => {
    if (purpose === "checkout") return "Verify your email to continue checkout";
    if (purpose === "password-change")
      return "Verify the code to confirm your password change";
    return "Verify your email address";
  }, [purpose]);

  const description = useMemo(() => {
    if (purpose === "checkout")
      return "We sent a code to your email before ticket purchase.";
    if (purpose === "password-change")
      return "Enter the code before updating your password.";
    return "Enter the verification code sent to your inbox to activate your account.";
  }, [purpose]);

  const handleResend = async () => {
    if (!email) return;

    setErrorMsg("");
    setIsResending(true);
    try {
      await authAPI.requestVerificationCode({ email, purpose });
      showNotification("A new verification code has been sent.", "success");
    } catch {
      showNotification("Unable to resend the verification code.", "error");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !code) return;

    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const response = await authAPI.verifyCode({ email, purpose, code });

      if (
        purpose === "registration" &&
        response.data?.token &&
        response.data?.user
      ) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      showNotification("Verification completed successfully.", "success");
      navigate(next, { replace: true });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Verification failed. Incorrect code.";
      setErrorMsg(msg);
      showNotification(
        error.response?.data?.message || "Verification failed.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-125 h-125 bg-brand-orange/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-100 h-100 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-lg rounded-4xl border border-white/10 bg-white/3 backdrop-blur-3xl p-6 md:p-8 shadow-2xl shadow-black/50 text-center relative mx-auto my-auto"
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent rounded-4xl pointer-events-none" />

        <div className="mx-auto w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,90,53,0.15)] relative">
          <FiShield className="text-2xl text-brand-orange relative z-10" />
          <div className="absolute inset-0 border border-brand-orange/30 rounded-full animate-ping opacity-20" />
        </div>

        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 uppercase">
          {title}
        </h1>

        {email && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 mb-4">
            <FiMail className="text-zinc-500 text-sm" />
            <span className="text-xs font-bold text-zinc-300">{email}</span>
          </div>
        )}

        <p className="text-zinc-400 font-medium mb-5 text-sm px-4">
          {description}
        </p>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-3 text-left">
                <FiAlertCircle className="text-red-400 text-xl shrink-0" />
                <p className="text-[11px] font-bold text-red-300 tracking-wider uppercase">
                  {errorMsg}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 relative z-10"
          animate={errorMsg ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-3 text-left">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">
              Secure Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="------"
              className={`w-full rounded-2xl border bg-black/40 px-4 py-4 text-center text-3xl font-mono font-black tracking-[0.5em] text-white outline-none transition-all duration-300 ${
                errorMsg
                  ? "border-red-500/50 focus:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)] text-red-100"
                  : "border-white/10 focus:border-brand-orange/50 focus:shadow-[0_0_30px_rgba(255,90,53,0.15)]"
              }`}
              maxLength={6}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-orange-600 disabled:opacity-60 shadow-lg shadow-brand-orange/20 cursor-pointer"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"} <FiArrowRight />
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-zinc-300 transition hover:text-white hover:bg-white/10 disabled:opacity-60 cursor-pointer"
            >
              <FiRefreshCw className={isResending ? "animate-spin" : ""} />
              {isResending ? "Sending..." : "Resend"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
