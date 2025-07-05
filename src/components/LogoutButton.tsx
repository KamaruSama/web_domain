'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center justify-center transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-1" />
      ออกจากระบบ
    </button>
  )
}
