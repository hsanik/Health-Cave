import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({ 
  size = "default", 
  className = "", 
  text = "", 
  variant = "default" 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const variantClasses = {
    default: "text-gray-600 dark:text-gray-400",
    primary: "text-[#435ba1]",
    white: "text-white",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <span className={cn(
          "text-sm font-medium",
          variantClasses[variant]
        )}>
          {text}
        </span>
      )}
    </div>
  );
};

// Preset loading components for common use cases
const ButtonSpinner = ({ text = "Loading...", variant = "white" }) => (
  <LoadingSpinner size="sm" text={text} variant={variant} />
);

const PageSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <LoadingSpinner size="lg" text={text} variant="primary" />
  </div>
);

const FullPageSpinner = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <LoadingSpinner size="xl" text={text} variant="primary" />
    </div>
  </div>
);

const InlineSpinner = ({ text = "", size = "sm" }) => (
  <LoadingSpinner size={size} text={text} variant="default" />
);

export { LoadingSpinner, ButtonSpinner, PageSpinner, FullPageSpinner, InlineSpinner };
export default LoadingSpinner;