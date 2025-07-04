'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center text-red-600 hover:text-red-700 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-1" />
      ออกจากระบบ
    </button>
  )
}
