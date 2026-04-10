import React from 'react';
import { cn } from '../utils/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Card({ className, children, ...props }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("glass rounded-2xl shadow-sm overflow-hidden glass-hover", className)} 
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-xl focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
    outline: "border border-border-subtle bg-white/5 hover:border-primary/50 text-text-main backdrop-blur-sm",
    ghost: "bg-transparent hover:bg-primary/10 text-text-dim hover:text-primary"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-11 px-5 py-2 text-sm",
    lg: "h-14 px-8 text-base"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function ProgressBar({ progress, className }) {
  return (
    <div className={cn("w-full bg-border-subtle/20 rounded-full h-2.5 overflow-hidden", className)}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="bg-gradient-to-r from-primary to-accent h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
      ></motion.div>
    </div>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: "bg-text-soft/10 text-text-dim border border-border-subtle",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    error: "bg-error/10 text-error border border-error/20"
  };

  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm", variants[variant], className)}
    >
      {children}
    </motion.span>
  );
}

