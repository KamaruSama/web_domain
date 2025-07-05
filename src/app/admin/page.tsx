'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  Clock,
  Shield,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Copy,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

interface User {
  id: string
  username: string
  role: string
  createdAt: string
}

interface DomainRequest {
  id: string
  domain: string
  purpose: string
  ipAddress: string
  requesterName: string
  responsibleName: string
  department: string
  contact: string
  requestedAt: string
  durationType: string
  expiresAt: string | null
  status: string
  approvalCooldownAt: string | null
  user: {
    username: string
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'รอพิจารณา' },
    APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'อนุมัติ' },
    REJECTED: { color: 'bg-red-100 text-red-800', icon: X, text: 'ไม่อนุมัติ' },
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  )
}

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<DomainRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('requests')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', role: 'USER' })
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (session) {
      if (session.user.role !== 'ADMIN') {
        router.push('/')
        return
      }
      fetchData()
    }
  }, [session, router])

  const fetchData = async () => {
    try {
      const [usersResponse, requestsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/requests')
      ])

      if (usersResponse.ok && requestsResponse.ok) {
        const [usersData, requestsData] = await Promise.all([
          usersResponse.json(),
          requestsResponse.json()
        ])
        setUsers(usersData)
        setRequests(requestsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const password = generatePassword()
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUser.username,
          password,
          role: newUser.role
        })
      })

      if (response.ok) {
        setGeneratedPassword(password)
        setShowPassword(true)
        setNewUser({ username: '', role: 'USER' })
        setShowAddUser(false)
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการลบผู้ใช้')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้')
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'approve' })
      })

      if (response.ok) {
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการอนุมัติคำขอ')
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('เกิดข้อผิดพลาดในการอนุมัติคำขอ')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'reject' })
      })

      if (response.ok) {
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการปฏิเสธคำขอ')
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('เกิดข้อผิดพลาดในการปฏิเสธคำขอ')
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

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const processedRequests = requests.filter(r => r.status !== 'PENDING')

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
            กลับหน้าแรก
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-red-600" />
                จัดการระบบ
              </h1>
              <p className="text-gray-600">ผู้ดูแลระบบ</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                หน้าแรก
              </Link>
              <Link href="/my-tickets" className="text-gray-600 hover:text-gray-900">
                คำขอทั้งหมด
              </Link>
              <Link href="/renewal-management" className="text-gray-600 hover:text-gray-900">
                จัดการคำขอต่ออายุ
              </Link>
              <Link href="/change-password" className="text-gray-600 hover:text-gray-900">
                เปลี่ยนรหัสผ่าน
              </Link>
              <span className="text-sm text-gray-700">
                สวัสดี, {session.user.username}
              </span>
              <LogoutButton className="bg-red-600 text-white px-3 py-1 rounded" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              คำขอโดเมน ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              จัดการผู้ใช้ ({users.length})
            </button>
          </nav>
        </div>

        {/* Generated Password Modal */}
        {showPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                รหัสผ่านที่สร้างขึ้น
              </h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">รหัสผ่านสำหรับผู้ใช้ใหม่:</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-white px-3 py-2 rounded border text-lg font-mono flex-1">
                    {generatedPassword}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>หมายเหตุ:</strong> กรุณาเก็บรหัสผ่านนี้ไว้ เพราะจะไม่สามารถดูได้อีกครั้ง
                </p>
              </div>
              <button
                onClick={() => setShowPassword(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                ปิด
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-8">
            {/* Pending Requests */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                คำขอรอพิจารณา ({pendingRequests.length})
              </h2>
              
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ไม่มีคำขอรอพิจารณา</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {pendingRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Processed Requests */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                คำขอที่ประมวลผลแล้ว ({processedRequests.length})
              </h2>
              
              {processedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ยังไม่มีคำขอที่ประมวลผล</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {processedRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      isProcessed={true}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                จัดการผู้ใช้ ({users.length})
              </h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
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
                className="bg-white rounded-xl shadow-lg p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">เพิ่มผู้ใช้ใหม่</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อผู้ใช้
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        บทบาท
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USER">ผู้ใช้</option>
                        <option value="ADMIN">ผู้ดูแล</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      เพิ่มผู้ใช้
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ผู้ใช้
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        บทบาท
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่สร้าง
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                              {user.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'ADMIN' ? 'ผู้ดูแล' : 'ผู้ใช้'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.username !== session.user.username && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              ลบ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const RequestCard = ({ 
  request, 
  onApprove, 
  onReject, 
  isProcessed = false 
}: { 
  request: DomainRequest
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  isProcessed?: boolean
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {request.domain}
          </h3>
          <StatusBadge status={request.status} />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">ผู้ขอ: {request.user.username}</p>
          <p className="text-sm text-gray-500">{formatDate(request.requestedAt)}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          {request.requesterName}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {request.department}
        </div>
        <p className="text-sm text-gray-500">
          IP: {request.ipAddress}
        </p>
        <p className="text-sm text-gray-500">
          ประเภท: {request.durationType === 'PERMANENT' ? 'ถาวร' : 'ชั่วคราว'}
        </p>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-700 font-medium mb-2">วัตถุประสงค์:</p>
        <p className="text-sm text-gray-600">{request.purpose}</p>
      </div>

      {!isProcessed && request.status === 'PENDING' && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onApprove?.(request.id)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            <Check className="w-4 h-4 mr-2" />
            อนุมัติ
          </button>
          <button
            onClick={() => onReject?.(request.id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            ไม่อนุมัติ
          </button>
        </div>
      )}
    </motion.div>
  )
}
