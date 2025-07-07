'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

interface SlideInProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  className?: string
}

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

interface StaggerItemProps {
  children: ReactNode
  index?: number
  className?: string
}

const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '' 
}: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const SlideIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5, 
  className = '' 
}: SlideInProps) => {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: StaggerContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const StaggerItem = ({ children, className = '' }: StaggerItemProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '' 
}: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const FloatIn = ({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  className = '' 
}: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const BouncyReveal = ({ 
  children, 
  delay = 0, 
  className = '' 
}: Omit<FadeInProps, 'duration'>) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export {
  PageTransition,
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  FloatIn,
  BouncyReveal
}

export default PageTransition
