'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'orange' | 'white'
  text?: string
  fullScreen?: boolean
}

interface PageLoaderProps {
  children?: ReactNode
  title?: string
  description?: string
}

interface FloatingElementsProps {
  count?: number
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'orange', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    primary: 'border-blue-200 border-t-blue-500',
    orange: 'border-orange-200 border-t-orange-500',
    white: 'border-white/30 border-t-white',
  }

  const spinnerElement = (
    <motion.div 
      className={`${sizes[size]} border-4 ${colors[color]} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="glass-morphism-orange rounded-2xl p-8 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {spinnerElement}
          {text && (
            <motion.p 
              className="text-gray-700 font-medium mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinnerElement}
      {text && (
        <motion.p 
          className="text-gray-700 font-medium mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

const FloatingElements = ({ count = 3 }: FloatingElementsProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`absolute w-72 h-72 rounded-full blur-3xl ${
            index === 0 ? 'bg-orange-300/20 top-20 left-20' :
            index === 1 ? 'bg-yellow-300/20 bottom-20 right-20' :
            'bg-orange-400/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: index === 2 ? [0, 360] : undefined,
          }}
          transition={{
            duration: index === 2 ? 20 : 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

const PageLoader = ({ children, title = "กำลังโหลด", description }: PageLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <FloatingElements />
      
      <motion.div 
        className="glass-morphism-orange rounded-2xl p-8 text-center relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children || (
          <>
            <LoadingSpinner size="xl" color="orange" />
            <motion.h2 
              className="text-xl font-bold text-gradient mt-4 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>
            {description && (
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {description}
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export { LoadingSpinner, PageLoader, FloatingElements }
export default LoadingSpinner
