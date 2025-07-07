'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  variant?: 'default' | 'orange' | 'strong'
  hover?: boolean
  className?: string
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, variant = 'default', hover = false, className = '', ...props }, ref) => {
    const variants = {
      default: 'glass-morphism',
      orange: 'glass-morphism-orange',
      strong: 'glass-strong',
    }

    const hoverVariants = {
      default: { y: -5, scale: 1.02 },
      tap: { scale: 0.98 }
    }

    return (
      <motion.div
        ref={ref}
        className={`${variants[variant]} rounded-2xl ${hover ? 'hover-lift' : ''} ${className}`}
        whileHover={hover ? hoverVariants.default : undefined}
        whileTap={hover ? hoverVariants.tap : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export default GlassCard
