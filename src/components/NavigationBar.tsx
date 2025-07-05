'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Home, 
  Ticket, 
  Shield, 
  RotateCcw, 
  Key, 
  LogOut,
  Globe 
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export default function NavigationBar() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Globe className="w-8 h-8 mr-3 text-blue-600" />
                ระบบขอใช้โดเมน
              </h1>
              <p className="text-gray-600 ml-11">มหาวิทยาลัยราชภัฏนครศรีธรรมราช</p>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  สวัสดี, {session.user.username}
                </span>
                <div className="flex space-x-2">
                  {/* Navigation buttons */}
                  <Link
                    href="/my-tickets"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    คำขอของฉัน
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <>
                      <Link
                        href="/admin"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        จัดการระบบ
                      </Link>
                      <Link
                        href="/renewal-management"
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        จัดการขอต่ออายุ
                      </Link>
                    </>
                  )}
                  <Link
                    href="/change-password"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    เปลี่ยนรหัสผ่าน
                  </Link>
                  <LogoutButton className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" />
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
