import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from '@/styles/buttons.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'gradient' | 'admin' | 'oauth';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  ...props 
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
