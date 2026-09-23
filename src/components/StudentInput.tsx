import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, CornerDownLeft, FileText, HeartHandshake, DollarSign, Home, Compass } from 'lucide-react';

interface StudentInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

const suggestions = [
  { icon: FileText, text: "I can't finish my assignment due to an emergency" },
  { icon: HeartHandshake, text: "I'm overwhelmed by exam stress and anxiety" },
  { icon: DollarSign, text: "I need urgent financial aid assistance" },
  { icon: Home, text: "I'm facing an unexpected housing issue" },
  { icon: Compass, text: "I need academic advising and course guidance" },
];

export default function StudentInput({ onSubmit, isLoading }: StudentInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header / Intro */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Autonomous Triage</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight heading-font mb-4"
        >
          How can we <span className="gradient-text">support you</span> today?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"
        >
          Tell us what's on your mind in your own words. We automatically connect you with the right campus departments, counselors, and extensions.
        </motion.p>
      </div>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={`relative rounded-3xl bg-white/95 backdrop-blur-xl border transition-all duration-300 p-3 shadow-xl ${
          isFocused
            ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-indigo-500/10 shadow-2xl'
            : 'border-slate-200/90 hover:border-slate-300 shadow-slate-200/40'
        }`}
      >
        <div className="px-3 pt-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your situation here... e.g. 'I'm experiencing intense burnout with my midterm exams coming up and need an extension on my project...'"
            rows={4}
            disabled={isLoading}
            className="w-full px-3 py-3 text-base sm:text-lg text-slate-800 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none rounded-2xl disabled:opacity-50 min-h-[130px] leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Footer Bar inside the card */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-2 border-t border-slate-100/80 mt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium bg-slate-100/80 px-2 py-1 rounded-md text-[11px] text-slate-500">
              <CornerDownLeft className="w-3 h-3" /> Press Enter
            </span>
            <span>to submit</span>
            {text.length > 0 && (
              <span className="text-slate-400 ml-1">· {text.length} chars</span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-md ${
              text.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Analyzing situation...</span>
              </>
            ) : (
              <>
                <span>Get Instant Support</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Suggested Quick Prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-2.5 justify-center items-center"
      >
        <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">Try asking:</span>
        {suggestions.map((item) => (
          <button
            key={item.text}
            onClick={() => setText(item.text)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-indigo-50/80 hover:text-indigo-700 rounded-full border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow transition-all duration-200"
          >
            <item.icon className="w-3.5 h-3.5 text-indigo-500" />
            <span>{item.text}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

