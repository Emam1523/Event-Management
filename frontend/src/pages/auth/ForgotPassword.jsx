import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiShield,
  FiArrowRight,
  FiLock,
  FiCheck,
  FiRefreshCw,
  FiKey,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../../services/api";
import { useNotifications } from "../../context/NotificationContext";

const OTP_TIMER = 30;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_TIMER);
  const [timerActive, setTimerActive] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [error, setError] = useState("");

  const { showNotification } = useNotifications();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.requestVerificationCode({
        email,
        purpose: "password-change",
      });
      showNotification("Verification code sent to your email.", "success");
      setStep(2);
      setTimer(OTP_TIMER);
      setTimerActive(true);
      setCode("");
      setCodeError("");
    } catch (error) {
      setError((await error.response?.data?.message) || "Failed to send code.");
      showNotification(
        (await error.response?.data?.message) || "Failed to send code.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      await authAPI.verifyCode({ email, purpose: "password-change", code });
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      showNotification("Code verified successfully.", "success");
      setStep(3);
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid or expired code";
      setCodeError(msg);
      showNotification(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await authAPI.requestVerificationCode({
        email,
        purpose: "password-change",
      });
      showNotification("New code sent.", "success");
      setTimer(OTP_TIMER);
      setTimerActive(true);
      setCode("");
      setCodeError("");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to resend code.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }
    if (password.length < 6) {
      showNotification("Password must be at least 6 characters.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await authAPI.confirmPasswordChange({
        email,
        code,
        newPassword: password,
      });
      showNotification(
        "Password updated successfully. You can now login.",
        "success",
      );
      navigate("/login");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to reset password.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setCode("");
      setCodeError("");
    }
    if (step > 1) setStep(step - 1);
  };

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timer / OTP_TIMER);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 pt-28 pb-8 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-150 h-150 bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-130 h-130 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-lg"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: step === s ? 1 : 0.85,
                  opacity: step >= s ? 1 : 0.3,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black ${
                  step >= s
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30"
                    : "bg-white/5 text-zinc-300/60 border border-white/10"
                }`}
              >
                {step > s ? <FiCheck className="text-lg" /> : s}
              </motion.div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 rounded-full ${step > s ? "bg-brand-orange" : "bg-white/10"}`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div className="rounded-4xl border border-white/10 bg-white/3 backdrop-blur-3xl p-8 md:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
          {/* <div className="sweep-light" /> */}

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="mx-auto w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(255,90,53,0.15)]">
                {step === 1 ? (
                  <FiKey className="text-2xl text-brand-orange" />
                ) : step === 2 ? (
                  <FiShield className="text-2xl text-brand-orange" />
                ) : (
                  <FiLock className="text-2xl text-brand-orange" />
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                {step === 1
                  ? "Forgot Password?"
                  : step === 2
                    ? "Enter Security Code"
                    : "Create New Password"}
              </h1>
              <p className="text-zinc-500 font-medium text-sm">
                {step === 1
                  ? "Enter your registered email to receive a security code"
                  : step === 2
                    ? `We sent a 6-digit code to ${email}`
                    : "Your identity has been verified. Set a new password."}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRequestCode}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300/60 group-focus-within:text-brand-orange transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-14 pr-4 text-white outline-none focus:border-brand-orange/50 focus:shadow-[0_0_30px_rgba(255,90,53,0.1)] transition-all font-bold placeholder:text-zinc-700"
                      />
                    </div>
                    {error && (
                      <motion.div
                        initial={{
                          x: -20,
                          opacity: 0,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                        }}
                      >
                        <p className="bg-red-400/20 text-red-500 border border-red-500 rounded-lg text-sm px-3 py-2">
                          {error}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-linear-to-r from-brand-orange to-brand-secondary text-white font-black py-5 rounded-2xl uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/20"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Code{" "}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyCode}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-20 h-20 mb-3">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                        <circle
                          cx="36"
                          cy="36"
                          r={radius}
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="4"
                        />
                        <motion.circle
                          cx="36"
                          cy="36"
                          r={radius}
                          fill="none"
                          stroke={timer > 10 ? "#ff5a35" : "#ef4444"}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={false}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 0.5, ease: "linear" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-2xl font-black ${timer > 10 ? "text-white" : "text-red-400"}`}
                        >
                          {timer}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                      {timerActive
                        ? "Time remaining"
                        : timer === 0
                          ? "Code expired — request a new one"
                          : ""}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">
                      Secure Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (codeError) setCodeError("");
                      }}
                      placeholder="--- ---"
                      disabled={!timerActive}
                      className={`w-full rounded-2xl border bg-black/30 px-4 py-4 text-center text-3xl font-mono font-black tracking-wider text-white outline-none transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                        codeError
                          ? "border-red-500/50 focus:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                          : "border-white/10 focus:border-brand-orange/50 focus:shadow-[0_0_30px_rgba(255,90,53,0.1)]"
                      }`}
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  {/* show error code message */}
                  <AnimatePresence>
                    {codeError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                      >
                        <FiAlertCircle className="text-red-400 shrink-0" />
                        <p className="text-[11px] font-bold text-red-300 tracking-wider uppercase">
                          {codeError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-3 pt-2">
                    <motion.button
                      type="submit"
                      disabled={isLoading || code.length !== 6 || !timerActive}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-linear-to-r from-brand-orange to-brand-secondary text-white font-black py-5 rounded-2xl uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/20"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        <>
                          Verify Identity <FiShield />
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading || timerActive}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-zinc-400 transition hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiRefreshCw
                        className={isLoading ? "animate-spin" : ""}
                      />
                      {timerActive ? `Resend in ${timer}s` : "Resend Code"}
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleResetPassword}
                  className="space-y-5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 mb-2"
                  >
                    <FiCheck className="text-green-400 shrink-0" />
                    <p className="text-[11px] font-bold text-green-300 tracking-wider uppercase">
                      Code verified — now set your new password
                    </p>
                  </motion.div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300/60 group-focus-within:text-brand-orange transition-colors" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-14 pr-4 text-white outline-none focus:border-brand-orange/50 focus:shadow-[0_0_30px_rgba(255,90,53,0.1)] transition-all font-bold placeholder:text-zinc-700"
                        minLength={6}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300/60 group-focus-within:text-brand-orange transition-colors" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-14 pr-4 text-white outline-none focus:border-brand-orange/50 focus:shadow-[0_0_30px_rgba(255,90,53,0.1)] transition-all font-bold placeholder:text-zinc-700"
                        minLength={6}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {password &&
                      confirmPassword &&
                      password !== confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] font-bold text-red-400 tracking-wider uppercase ml-1 flex items-center gap-2"
                        >
                          <FiAlertCircle className="text-red-400" />
                          Passwords do not match
                        </motion.p>
                      )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isLoading || !password || !confirmPassword}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-linear-to-r from-brand-orange to-brand-secondary text-white font-black py-5 rounded-2xl uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/20"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      <>
                        Reset Password <FiCheck />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 text-zinc-300/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group"
                >
                  <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              ) : (
                <div />
              )}
              <Link
                to="/login"
                className="text-zinc-300/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
