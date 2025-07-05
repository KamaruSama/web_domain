'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Trash2,
  Shield,
  User,
  Calendar,
  AlertCircle,
  Copy,
  ArrowLeft,
  UserCheck,
  UserX,
  Key
} from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

interface User {
  id: string
  username: string
  role: string
  createdAt: string
}

export default function UsersManagementPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', role: 'USER' })
  const [generatedPassword, setGeneratedPassword] = useState('')

  useEffect(() => {
    if (session?.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchUsers()
  }, [session, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newUser.username.trim()) {
      alert('กรุณากรอก username')
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUser.username.trim(),
          role: newUser.role
        })
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedPassword(result.password)
        setNewUser({ username: '', role: 'USER' })
        fetchUsers()
        // Don't hide the form immediately to show the generated password
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้')
    }
  }

  const handleDeleteUser = async (userId: string, username: string) => {
    if (session?.user.id === userId) {
      alert('คุณไม่สามารถลบตัวเองได้')
      return
    }

    if (!confirm(`คุณต้องการลบผู้ใช้ "${username}" ใช่หรือไม่?`)) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการลบผู้ใช้')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('คัดลอกแล้ว!')
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const closeAddUserForm = () => {
    setShowAddUser(false)
    setNewUser({ username: '', role: 'USER' })
    setGeneratedPassword('')
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบ</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    )
  }

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-purple-600" />
                  จัดการผู้ใช้
                </h1>
                <p className="text-gray-600">เพิ่ม ลบ และจัดการบัญชีผู้ใช้</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                หน้าแรก
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                จัดการระบบ
              </Link>
              <Link href="/change-password" className="text-gray-600 hover:text-gray-900">
                เปลี่ยนรหัสผ่าน
              </Link>
              <span className="text-sm text-gray-700">
                สวัสดี, {session.user.username}
              </span>
              <LogoutButton className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Users Management */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              รายการผู้ใช้ ({users.length})
            </h2>
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้ใช้
            </button>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-4">เพิ่มผู้ใช้ใหม่</h3>
              
              {generatedPassword && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-900 mb-2">เพิ่มผู้ใช้สำเร็จ!</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-700">รหัสผ่าน:</span>
                    <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono">
                      {generatedPassword}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedPassword)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    กรุณาเก็บรหัสผ่านนี้ไว้ เพราะจะไม่แสดงอีกครั้ง
                  </p>
                </div>
              )}

              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="กรอก username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      บทบาท
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="USER">ผู้ใช้ทั่วไป</option>
                      <option value="ADMIN">ผู้ดูแลระบบ</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeAddUserForm}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    เพิ่มผู้ใช้
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Users List */}
          <div className="grid gap-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {user.role === 'ADMIN' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ADMIN' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            ผู้ดูแลระบบ
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 mr-1" />
                            ผู้ใช้ทั่วไป
                          </>
                        )}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.id === session.user.id && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      คุณ
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    disabled={user.id === session.user.id}
                    className={`p-2 rounded-lg ${
                      user.id === session.user.id 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={user.id === session.user.id ? 'ไม่สามารถลบตัวเองได้' : 'ลบผู้ใช้'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่พบผู้ใช้ในระบบ</p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            คำแนะนำการใช้งาน
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">การเพิ่มผู้ใช้</h4>
              <ul className="space-y-1">
                <li>• คลิก "เพิ่มผู้ใช้" และกรอกข้อมูล</li>
                <li>• รหัสผ่านจะถูกสร้างอัตโนมัติ</li>
                <li>• บันทึกรหัสผ่านให้ผู้ใช้ทราบ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">การลบผู้ใช้</h4>
              <ul className="space-y-1">
                <li>• คลิกปุ่มถังขยะเพื่อลบผู้ใช้</li>
                <li>• ไม่สามารถลบตัวเองได้</li>
                <li>• การลบจะเป็นการลบถาวร</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}