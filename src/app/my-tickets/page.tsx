'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  RefreshCw,
  User,
  Building,
  Mail,
  Calendar,
  Globe,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

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
  domain_record?: {
    id: string
    status: string
    lastUsedAt: string | null
    deletedAt: string | null
    trashExpiresAt: string | null
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'รอพิจารณา' },
    APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'อนุมัติ' },
    REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'ไม่อนุมัติ' },
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

const DomainStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'ใช้งาน' },
    EXPIRED: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'หมดอายุ' },
    TRASHED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'ในถังขยะ' },
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

export default function MyTicketsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<DomainRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchMyRequests()
    }
  }, [session])

  const fetchMyRequests = async () => {
    try {
      const response = await fetch('/api/my-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching my requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('คุณต้องการลบคำขอนี้ใช่หรือไม่?')) return

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchMyRequests()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการลบคำขอ')
      }
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('เกิดข้อผิดพลาดในการลบคำขอ')
    }
  }

  const handleRenewDomain = async (requestId: string) => {
    const newExpiryDate = prompt('กรุณาระบุวันหมดอายุใหม่ (YYYY-MM-DD):')
    if (!newExpiryDate) return

    try {
      const response = await fetch(`/api/domains/${requestId}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresAt: newExpiryDate })
      })

      if (response.ok) {
        fetchMyRequests()
        alert('ต่ออายุโดเมนสำเร็จ')
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการต่ออายุโดเมน')
      }
    } catch (error) {
      console.error('Error renewing domain:', error)
      alert('เกิดข้อผิดพลาดในการต่ออายุโดเมน')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const approvedRequests = requests.filter(r => r.status === 'APPROVED')
  const rejectedRequests = requests.filter(r => r.status === 'REJECTED')

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
                <Ticket className="w-6 h-6 mr-2 text-blue-600" />
                คำขอของฉัน
              </h1>
              <p className="text-gray-600">จัดการคำขอใช้โดเมนของคุณ</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                หน้าแรก
              </Link>
              <Link href="/request" className="text-gray-600 hover:text-gray-900">
                ขอใช้โดเมน
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  จัดการระบบ
                </Link>
              )}
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">รอพิจารณา</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">อนุมัติ</p>
                <p className="text-2xl font-semibold text-gray-900">{approvedRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ไม่อนุมัติ</p>
                <p className="text-2xl font-semibold text-gray-900">{rejectedRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Sections */}
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onDelete={handleDeleteRequest}
                    canDelete={true}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Approved Requests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              คำขอที่อนุมัติแล้ว ({approvedRequests.length})
            </h2>
            
            {approvedRequests.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีคำขอที่อนุมัติแล้ว</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {approvedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onRenew={handleRenewDomain}
                    canRenew={request.durationType === 'TEMPORARY'}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Rejected Requests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              คำขอที่ไม่อนุมัติ ({rejectedRequests.length})
            </h2>
            
            {rejectedRequests.length === 0 ? (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีคำขอที่ไม่อนุมัติ</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rejectedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onDelete={handleDeleteRequest}
                    canDelete={true}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

const RequestCard = ({ 
  request, 
  onDelete, 
  onRenew, 
  canDelete = false, 
  canRenew = false 
}: { 
  request: DomainRequest
  onDelete?: (id: string) => void
  onRenew?: (id: string) => void
  canDelete?: boolean
  canRenew?: boolean
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const showRenewButton = canRenew && request.expiresAt && (
    isExpired(request.expiresAt) || 
    request.domain_record?.status === 'EXPIRED' ||
    request.domain_record?.status === 'TRASHED'
  )

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
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={request.status} />
            {request.domain_record && (
              <DomainStatusBadge status={request.domain_record.status} />
            )}
          </div>
        </div>
        <Globe className="w-8 h-8 text-blue-600" />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          {request.requesterName}
        </div>
        <div className="flex items-center">
          <Building className="w-4 h-4 mr-2" />
          {request.department}
        </div>
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          {request.contact}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(request.requestedAt)}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700 font-medium mb-2">
          วัตถุประสงค์:
        </p>
        <p className="text-sm text-gray-600">
          {request.purpose}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          IP: {request.ipAddress}
        </p>
        <p className="text-sm text-gray-500">
          ประเภท: {request.durationType === 'PERMANENT' ? 'ถาวร' : 'ชั่วคราว'}
        </p>
        {request.expiresAt && (
          <p className={`text-sm ${isExpired(request.expiresAt) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            หมดอายุ: {formatDate(request.expiresAt)}
            {isExpired(request.expiresAt) && ' (หมดอายุแล้ว)'}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(canDelete || showRenewButton) && (
        <div className="flex space-x-2 mt-4">
          {showRenewButton && (
            <button
              onClick={() => onRenew?.(request.id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              ต่ออายุ
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete?.(request.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ลบ
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
