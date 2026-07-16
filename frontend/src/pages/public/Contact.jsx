import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiMessageSquare,
  FiFileText,
} from "react-icons/fi";
import { MdFace } from "react-icons/md";
import { contactAPI } from "../../services/api";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submit(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-dark-bg min-h-screen pt-32 pb-24 text-zinc-200">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8 leading-none">
                GET IN <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 via-rose-500 to-amber-500 animate-gradient-x">
                  TOUCH.
                </span>
              </h1>
              <p className="text-xl text-zinc-400 mb-12 font-medium leading-relaxed max-w-md">
                Have a question or need assistance? Our team is here to help you
                experience the extraordinary.
              </p>

              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-xl">
                    <FiMail />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500 mb-2">
                      Email Us
                    </p>
                    <p className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">
                      <a href="mailto:nextdhaka101@gmail.com">
                        nextdhaka101@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 text-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-xl">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500 mb-2">
                      Call Us
                    </p>
                    <p className="text-xl font-bold text-white group-hover:text-rose-500 transition-colors">
                      <a href="tel:+8801318672928">+8801318672928</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 text-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-xl">
                    <FiMapPin />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500 mb-2">
                      Visit Us
                    </p>
                    <p className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                      <span>Plot-11.Section-10,Main road -1,</span>
                      <br />
                      <span>Senpara Parbata,Mirpur-10,Dhaka-1216</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-card p-12 bg-white/5 border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <FiMessageSquare size={120} className="text-primary" />
                </div>

                {submitted ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl border border-emerald-500/20">
                      <FiSend />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                      Message Sent!
                    </h2>
                    <p className="text-zinc-400 font-medium mb-10">
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-primary"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-8 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                          Full Name
                        </label>
                        <div className="relative group">
                          <MdFace
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
                            size={18}
                          />
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Emam Hassan"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                          Email Address
                        </label>
                        <div className="relative group">
                          <FiMail
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
                            size={18}
                          />

                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Subject
                      </label>
                      <div className="relative group">
                        <FiFileText
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
                          size={18}
                        />
                        <input
                          required
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">
                        Message
                      </label>
                      <textarea
                        required
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-zinc-700 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full btn-primary py-5 text-sm"
                    >
                      {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
