import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import logo from "../../assets/logosm.png";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import GoogleLoginButton from "../../components/common/GoogleLoginButton";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, logout, googleLogin } = useAuth();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/profile";

  // ✅ Input Handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.verificationRequired) {
        navigate(
          `/verify-email?email=${encodeURIComponent(
            result.email,
          )}&purpose=registration&next=${result.user?.role === "admin" ? "/admin" : "/profile"}`,
          { replace: true },
        );
      } else if (result.success) {
        showNotification("Successfully logged in!", "success");

        if (from !== "/profile") {
          navigate(from, { replace: true });
        } else {
          const role = result.user?.role;
          navigate(role === "admin" ? "/admin" : "/profile", {
            replace: true,
          });
        }
      } else {
        showNotification(result.message, "error");
        await logout();
      }
    } catch (error) {
      showNotification(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    select_account: true,
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Trigger the context function
        const result = await googleLogin(tokenResponse.access_token);

        if (result.success) {
          showNotification(result.message, "success");

          // Navigate user to the next logical screen
          if (from !== "/profile") {
            navigate(from, { replace: true });
          } else {
            const role = result.user?.role;
            navigate(role === "admin" ? "/admin" : "/profile", {
              replace: true,
            });
          }
        } else {
          showNotification(result.message, "error");
          await logout();
        }
      } catch (error) {
        console.log(error);
        showNotification(
          "An unexpected error occurred during Google sign-in.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    },
    onNonOAuthError: (nae) => {
      console.log(nae.type);
    },
    onError: (error) => {
      console.log(error.error);
      showNotification(
        error.error_description || "Google Sign-In was canceled",
        "error",
      );
    },
  });

  // ✅ Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group border-r border-white/5">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/auth_background.png"
            alt="Event Background"
            className="w-full h-full object-cover grayscale-20 group-hover:scale-105 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-[#030303] via-[#030303]/40 to-transparent" />
        </motion.div>

        {/* ✅ FIXED: Added wrapper for proper vertical stacking and padding */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 pt-28 sm:pt-32 lg:pt-36">
          <div className="max-w-md my-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8"
            >
              WELCOME <br />
              <span className="text-transparent bg-linear-to-r bg-clip-text from-orange-400 to-orange-900 italic">
                BACK MEMBER.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="space-y-6"
            >
              {[
                "Access your booked events instantly",
                "Manage tickets and active QR codes",
                "Receive priority updates and entry passes",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-zinc-400 group/item"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                    <FiCheckCircle size={14} />
                  </div>
                  <span className="text-sm font-medium tracking-wide">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 pt-28 sm:pt-32 lg:pt-36 relative z-10">
        <div className="absolute inset-0 -z-10 lg:hidden">
          <img
            src="/auth_background.png"
            alt="Event Background"
            className="w-full h-full opacity-70 object-cover grayscale-20 group-hover:scale-105 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-[#030303] via-[#030303]/40 to-transparent" />
        </div>

        <div className="absolute top-1/4 right-1/4 w-110 h-110 bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-130 w-full min-h-130 flex flex-col justify-center relative z-10 bg-white/2 backdrop-blur-xl border border-white/5 p-8 sm:pt-12 sm:pb-8 sm:px-12 rounded-4xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border-t-white/10"
        >
          <div className="mb-6">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black text-orange-500 tracking-tight mb-4 flex flex-col items-center justify-center gap-2"
            >
              <img
                className="rounded-lg shadow-2xl shadow-orange-800/60 aspect-square"
                src={logo}
                alt="logo"
                width={64}
                height={64}
              />
              Welcome Back
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-zinc-400 font-medium"
            >
              Secure your tickets, keep your preferences saved, and follow your
              orders in real-time.
            </motion.p>
          </div>

          <div title="login box" className="space-y-2">
            <motion.form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-black text-zinc-500 uppercase ml-1"
                >
                  Email
                </label>
                <div className="relative group">
                  <FiMail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="email"
                    className="text-xs font-black text-zinc-500 uppercase ml-1"
                  >
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <FiLock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  {/* ✅ FIXED: Added aria-label for accessibility */}
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-primary/70 uppercase tracking-wider hover:underline float-right"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-disabled={isLoading}
                  className="btn-primary w-full group active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      SIGN IN{" "}
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          </div>

          <div className="relative w-full flex items-center gap-2 my-4">
            <hr className="w-full border-zinc-700" />
            <span className="border border-zinc-700 z-10 rounded-md px-2 text-white">
              Or
            </span>
            <hr className="w-full border-zinc-700" />
          </div>

          <GoogleLoginButton onClick={handleGoogleLogin} />

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center border-t border-zinc-700 pt-2"
          >
            <p className="text-zinc-500 font-medium">
              New to NEXT DHAKA?{" "}
              <Link
                to="/register"
                className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Join Us Today
              </Link>
            </p>
            <div>
              <p className="text-sm text-center text-zinc-400">
                By continuing you agree to our{" "}
                <a
                  className="text-primary font-bold"
                  href="/terms-and-conditions"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a className="text-primary font-bold" href="/privacy-policy">
                  Privacy Policy.
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
