import React from 'react';
import { cn } from '../utils/utils';

export function Card({ className, children, ...props }) {
  return (
    <div 
      className={cn("bg-card rounded-2xl shadow-sm border border-border overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    outline: "border-2 border-border bg-transparent hover:border-primary text-text-primary",
    ghost: "bg-transparent hover:bg-background-soft text-text-secondary"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ progress, className }) {
  return (
    <div className={cn("w-full bg-background-soft rounded-full h-2.5", className)}>
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-300" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: "bg-background-soft text-text-secondary border border-border",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    error: "bg-error/10 text-error border border-error/20"
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
