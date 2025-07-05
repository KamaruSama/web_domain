'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'type'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled = false,
    className = '', 
    type = 'button',
    ...props 
  }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      danger: 'btn-danger',
      warning: 'btn-warning',
      glass: 'btn-glass',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const buttonVariants = {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
      disabled: { opacity: 0.5 }
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
        variants={buttonVariants}
        whileHover={disabled || loading ? undefined : "hover"}
        whileTap={disabled || loading ? undefined : "tap"}
        animate={disabled ? "disabled" : undefined}
        {...props}
      >
        {loading ? (
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            กำลังโหลด...
          </motion.div>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

export default AnimatedButton
