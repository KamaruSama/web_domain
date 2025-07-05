'use client'

import { motion } from 'framer-motion'
import { ReactNode, InputHTMLAttributes, forwardRef } from 'react'

interface AnimatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  success?: string
  icon?: ReactNode
  rightIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass'
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ 
    label,
    error,
    success,
    icon,
    rightIcon,
    size = 'md',
    variant = 'glass',
    className = '',
    ...props 
  }, ref) => {
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    }

    const variants = {
      default: 'border border-gray-300 bg-white',
      glass: 'form-input',
    }

    const inputVariants = {
      focus: { scale: 1.02 },
      blur: { scale: 1 }
    }

    return (
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <motion.label 
            className="form-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {icon && (
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              whileHover={{ scale: 1.1 }}
            >
              {icon}
            </motion.div>
          )}
          
          <motion.input
            ref={ref}
            className={`
              ${variants[variant]} 
              ${sizes[size]} 
              ${icon ? 'pl-10' : ''} 
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-300 focus:ring-red-500' : ''}
              ${success ? 'border-green-300 focus:ring-green-500' : ''}
              ${className}
            `}
            variants={inputVariants}
            whileFocus="focus"
            onBlur={() => inputVariants.blur}
            {...props}
          />
          
          {rightIcon && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
              whileHover={{ scale: 1.1 }}
            >
              {rightIcon}
            </motion.div>
          )}
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-error flex items-center mt-1"
          >
            <span className="text-red-600 text-sm font-medium">{error}</span>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 text-sm font-medium mt-1"
          >
            {success}
          </motion.div>
        )}
      </motion.div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'

export default AnimatedInput
