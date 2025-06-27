import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  className?: string;
  centered?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner',
  text,
  className = '',
  centered = false
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2 className={`${getSizeClasses()} animate-spin text-blue-600`} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`${getSizeClasses()} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${getSizeClasses()} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${getSizeClasses()} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${getSizeClasses()} bg-blue-600 rounded-full animate-pulse`}></div>
        );
      
      default:
        return (
          <Loader2 className={`${getSizeClasses()} animate-spin text-blue-600`} />
        );
    }
  };

  const containerClass = `
    ${centered ? 'flex flex-col items-center justify-center' : 'flex items-center'} 
    ${text ? 'gap-3' : ''} 
    ${className}
  `;

  return (
    <div className={containerClass}>
      {renderSpinner()}
      {text && (
        <span className={`${getTextSize()} text-gray-600 font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
}

// Componentes específicos para casos comuns
export const PageLoader = ({ text = "Carregando..." }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" text={text} centered />
  </div>
);

export const ButtonLoader = ({ text = "Carregando..." }: { text?: string }) => (
  <LoadingSpinner size="sm" text={text} className="justify-center" />
);

export const InlineLoader = ({ text }: { text?: string }) => (
  <LoadingSpinner size="sm" text={text} />
);

export const OverlayLoader = ({ text = "Processando..." }: { text?: string }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <LoadingSpinner size="lg" text={text} centered />
    </div>
  </div>
); 