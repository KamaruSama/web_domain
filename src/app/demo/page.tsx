'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Heart, 
  Star, 
  Globe, 
  Shield, 
  User, 
  Eye,
  EyeOff,
  Search,
  Settings
} from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedButton from '@/components/AnimatedButton'
import AnimatedInput from '@/components/AnimatedInput'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  PageTransition, 
  FadeIn, 
  SlideIn, 
  StaggerContainer, 
  StaggerItem,
  ScaleIn,
  FloatIn,
  BouncyReveal
} from '@/components/PageTransition'

export default function DemoPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <PageTransition className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="header-glass sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <FadeIn delay={0.2}>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 glass-morphism-orange rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Demo Components</h1>
                  <p className="text-gray-600">แสดงตัวอย่างการใช้งาน Components</p>
                </div>
              </div>
            </FadeIn>
            
            <SlideIn direction="left" delay={0.4}>
              <AnimatedButton variant="primary">
                <Settings className="w-4 h-4 mr-2" />
                กลับหน้าแรก
              </AnimatedButton>
            </SlideIn>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Glass Cards Section */}
        <section>
          <FadeIn delay={0.6}>
            <h2 className="text-3xl font-bold text-gradient mb-8 text-center">Glass Cards</h2>
          </FadeIn>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <GlassCard variant="default" hover className="p-6">
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Globe className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Default Glass</h3>
                  <p className="text-gray-600">Glass effect แบบพื้นฐาน</p>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard variant="orange" hover className="p-6">
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Heart className="w-8 h-8 text-orange-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Orange Glass</h3>
                  <p className="text-gray-600">Glass effect สีส้ม</p>
                </div>
              </GlassCard>
            </StaggerItem>

            <StaggerItem>
              <GlassCard variant="strong" hover className="p-6">
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Shield className="w-8 h-8 text-purple-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Strong Glass</h3>
                  <p className="text-gray-600">Glass effect แบบเข้ม</p>
                </div>
              </GlassCard>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Buttons Section */}
        <section>
          <ScaleIn delay={0.8}>
            <h2 className="text-3xl font-bold text-gradient mb-8 text-center">Animated Buttons</h2>
          </ScaleIn>
          
          <StaggerContainer className="flex flex-wrap gap-4 justify-center">
            <StaggerItem>
              <AnimatedButton variant="primary" onClick={handleButtonClick} loading={loading}>
                <Star className="w-4 h-4 mr-2" />
                Primary Button
              </AnimatedButton>
            </StaggerItem>
            
            <StaggerItem>
              <AnimatedButton variant="secondary">
                <User className="w-4 h-4 mr-2" />
                Secondary
              </AnimatedButton>
            </StaggerItem>
            
            <StaggerItem>
              <AnimatedButton variant="success">
                <Sparkles className="w-4 h-4 mr-2" />
                Success
              </AnimatedButton>
            </StaggerItem>
            
            <StaggerItem>
              <AnimatedButton variant="danger">
                <Heart className="w-4 h-4 mr-2" />
                Danger
              </AnimatedButton>
            </StaggerItem>
            
            <StaggerItem>
              <AnimatedButton variant="warning">
                <Settings className="w-4 h-4 mr-2" />
                Warning
              </AnimatedButton>
            </StaggerItem>
            
            <StaggerItem>
              <AnimatedButton variant="glass">
                <Globe className="w-4 h-4 mr-2" />
                Glass
              </AnimatedButton>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Inputs Section */}
        <section>
          <FloatIn delay={1.0}>
            <h2 className="text-3xl font-bold text-gradient mb-8 text-center">Animated Inputs</h2>
          </FloatIn>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <StaggerContainer>
              <StaggerItem>
                <AnimatedInput
                  label="ชื่อผู้ใช้"
                  placeholder="กรอกชื่อผู้ใช้"
                  icon={<User className="w-5 h-5 text-orange-500" />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </StaggerItem>
              
              <StaggerItem>
                <AnimatedInput
                  label="รหัสผ่าน"
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  icon={<Shield className="w-5 h-5 text-orange-500" />}
                  rightIcon={
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-orange-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
              </StaggerItem>
              
              <StaggerItem>
                <AnimatedInput
                  label="ค้นหา"
                  placeholder="ค้นหาข้อมูล..."
                  icon={<Search className="w-5 h-5 text-orange-500" />}
                  success={inputValue ? "ข้อมูลถูกต้อง" : undefined}
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Loading Section */}
        <section>
          <BouncyReveal delay={1.2}>
            <h2 className="text-3xl font-bold text-gradient mb-8 text-center">Loading Components</h2>
          </BouncyReveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
              <GlassCard variant="orange" className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Small</h3>
                <LoadingSpinner size="sm" color="orange" />
              </GlassCard>
            </StaggerItem>
            
            <StaggerItem>
              <GlassCard variant="orange" className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Medium</h3>
                <LoadingSpinner size="md" color="orange" />
              </GlassCard>
            </StaggerItem>
            
            <StaggerItem>
              <GlassCard variant="orange" className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Large</h3>
                <LoadingSpinner size="lg" color="orange" />
              </GlassCard>
            </StaggerItem>
            
            <StaggerItem>
              <GlassCard variant="orange" className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Extra Large</h3>
                <LoadingSpinner size="xl" color="orange" />
              </GlassCard>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Animation Examples */}
        <section>
          <motion.h2 
            className="text-3xl font-bold text-gradient mb-8 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 300 }}
          >
            Animation Examples
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={1.6}>
              <GlassCard variant="orange" hover className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold">Fade In</h3>
                <p className="text-sm text-gray-600 mt-2">เฟดอินธรรมดา</p>
              </GlassCard>
            </FadeIn>
            
            <SlideIn direction="up" delay={1.7}>
              <GlassCard variant="orange" hover className="p-6 text-center">
                <Star className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold">Slide Up</h3>
                <p className="text-sm text-gray-600 mt-2">เลื่อนขึ้นมา</p>
              </GlassCard>
            </SlideIn>
            
            <ScaleIn delay={1.8}>
              <GlassCard variant="orange" hover className="p-6 text-center">
                <Heart className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold">Scale In</h3>
                <p className="text-sm text-gray-600 mt-2">ขยายเข้ามา</p>
              </GlassCard>
            </ScaleIn>
            
            <BouncyReveal delay={1.9}>
              <GlassCard variant="orange" hover className="p-6 text-center">
                <Globe className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold">Bouncy</h3>
                <p className="text-sm text-gray-600 mt-2">แบบเด้งดึ๋ง</p>
              </GlassCard>
            </BouncyReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
            className="glass-morphism-orange rounded-2xl p-6 inline-block"
          >
            <p className="text-gray-600">
              🎨 Demo สำหรับ Components ใหม่ที่สวยงาม ✨
            </p>
            <p className="text-sm text-gray-500 mt-2">
              สร้างด้วย Next.js, Tailwind CSS, Framer Motion และ ❤️
            </p>
          </motion.div>
        </footer>
      </main>
    </PageTransition>
  )
}
