import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

interface StudentInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Support
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-slate-900 mb-3"
        >
          How can we help?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-slate-500 max-w-md mx-auto"
        >
          Tell us what's happening in your own words. You don't need to know which department to contact.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={`relative rounded-2xl border-2 transition-all duration-300 bg-white shadow-sm ${
          isFocused
            ? 'border-indigo-400 shadow-lg shadow-indigo-100'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={`"I'm stressed about exams and I can't finish my assignment..."`}
          rows={5}
          disabled={isLoading}
          className="w-full px-6 py-5 text-base text-slate-800 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none rounded-2xl disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <div className="flex items-center justify-between px-5 pb-4">
          <p className="text-xs text-slate-400">
            {text.length > 0 ? `${text.length} characters` : 'Press Enter to submit'}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              text.trim() && !isLoading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Analyzing...
              </>
            ) : (
              <>
                Get Support
                <Send className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-2 justify-center"
      >
        {[
          "I can't finish my assignment",
          "I'm stressed about exams",
          "I need financial help",
          "Housing concern",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setText(suggestion)}
            className="px-4 py-2 text-sm text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
