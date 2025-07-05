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
  AlertCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface RenewalRequest {
  id: string
  domainId: string
  newExpiryDate: string
  reason: string | null
  requestedAt: string
  status: string
  user: {
    username: string
  }
  domain: {
    id: string
    domainRequest: {
      id: string
      domain: string
      purpose: string
      durationType: string
      expiresAt: string | null
    }
  }
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
  const [renewalRequests, setRenewalRequests] = useState<RenewalRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchMyRequests()
      fetchRenewalRequests()
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

  const fetchRenewalRequests = async () => {
    try {
      const response = await fetch('/api/renewal-requests')
      if (response.ok) {
        const data = await response.json()
        setRenewalRequests(data)
      }
    } catch (error) {
      console.error('Error fetching renewal requests:', error)
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

  const handleDeleteRenewalRequest = async (renewalId: string) => {
    if (!confirm('คุณต้องการลบคำขอต่ออายุนี้ใช่หรือไม่?')) return

    try {
      const response = await fetch(`/api/renewal-requests/${renewalId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('ลบคำขอต่ออายุสำเร็จ')
        fetchRenewalRequests()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการลบคำขอต่ออายุ')
      }
    } catch (error) {
      console.error('Error deleting renewal request:', error)
      alert('เกิดข้อผิดพลาดในการลบคำขอต่ออายุ')
    }
  }

  const handleApproveRenewalRequest = async (renewalId: string, action: string) => {
    try {
      const response = await fetch(`/api/renewal-requests/${renewalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        const message = action === 'approve' ? 'อนุมัติคำขอต่ออายุสำเร็จ' : 'ปฏิเสธคำขอต่ออายุสำเร็จ'
        alert(message)
        fetchRenewalRequests()
        fetchMyRequests()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการดำเนินการ')
      }
    } catch (error) {
      console.error('Error processing renewal request:', error)
      alert('เกิดข้อผิดพลาดในการดำเนินการ')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const approvedRequests = requests.filter(r => r.status === 'APPROVED')
  const rejectedRequests = requests.filter(r => r.status === 'REJECTED')

  const pendingRenewalRequests = renewalRequests.filter(r => r.status === 'PENDING')
  const approvedRenewalRequests = renewalRequests.filter(r => r.status === 'APPROVED')
  const rejectedRenewalRequests = renewalRequests.filter(r => r.status === 'REJECTED')

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
                {session.user.role === 'ADMIN' ? 'จัดการคำขอทั้งหมด' : 'คำขอของฉัน'}
              </h1>
              <p className="text-gray-600">
                {session.user.role === 'ADMIN' ? 'จัดการคำขอใช้โดเมนทั้งหมด' : 'จัดการคำขอใช้โดเมนของคุณ'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                หน้าแรก
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/renewal-management" className="text-gray-600 hover:text-gray-900">
                  จัดการคำขอต่ออายุ
                </Link>
              )}
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  จัดการระบบ
                </Link>
              )}
              <span className="text-sm text-gray-700">
                สวัสดี, {session.user.username}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Domain Requests Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-600" />
            คำขอใช้โดเมน
          </h2>

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

          {/* Domain Requests Sections */}
          <div className="space-y-8">
            {/* Pending Requests */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                คำขอรอพิจารณา ({pendingRequests.length})
              </h3>
              
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
                      isAdmin={session.user.role === 'ADMIN'}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Approved Requests */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                คำขอที่อนุมัติแล้ว ({approvedRequests.length})
              </h3>
              
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
                      isAdmin={session.user.role === 'ADMIN'}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Rejected Requests */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                คำขอที่ไม่อนุมัติ ({rejectedRequests.length})
              </h3>
              
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
                      isAdmin={session.user.role === 'ADMIN'}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Renewal Requests Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <RefreshCw className="w-6 h-6 mr-2 text-green-600" />
            คำขอต่ออายุ
          </h2>

          {/* Renewal Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">รอพิจารณา</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingRenewalRequests.length}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{approvedRenewalRequests.length}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{rejectedRenewalRequests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Renewal Requests Sections */}
          <div className="space-y-8">
            {/* Pending Renewal Requests */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                คำขอต่ออายุรอพิจารณา ({pendingRenewalRequests.length})
              </h3>
              
              {pendingRenewalRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ไม่มีคำขอต่ออายุรอพิจารณา</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingRenewalRequests.map((request) => (
                    <RenewalRequestCard
                      key={request.id}
                      request={request}
                      onDelete={handleDeleteRenewalRequest}
                      canDelete={true}
                      isAdmin={session.user.role === 'ADMIN'}
                      onApprove={handleApproveRenewalRequest}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Approved Renewal Requests */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                คำขอต่ออายุที่อนุมัติแล้ว ({approvedRenewalRequests.length})
              </h3>
              
              {approvedRenewalRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ไม่มีคำขอต่ออายุที่อนุมัติแล้ว</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {approvedRenewalRequests.map((request) => (
                    <RenewalRequestCard
                      key={request.id}
                      request={request}
                      isAdmin={session.user.role === 'ADMIN'}
                      onApprove={handleApproveRenewalRequest}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Rejected Renewal Requests */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                คำขอต่ออายุที่ไม่อนุมัติ ({rejectedRenewalRequests.length})
              </h3>
              
              {rejectedRenewalRequests.length === 0 ? (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ไม่มีคำขอต่ออายุที่ไม่อนุมัติ</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rejectedRenewalRequests.map((request) => (
                    <RenewalRequestCard
                      key={request.id}
                      request={request}
                      onDelete={handleDeleteRenewalRequest}
                      canDelete={true}
                      isAdmin={session.user.role === 'ADMIN'}
                      onApprove={handleApproveRenewalRequest}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

const RequestCard = ({ 
  request, 
  onDelete, 
  canDelete = false,
  isAdmin = false
}: { 
  request: DomainRequest
  onDelete?: (id: string) => void
  canDelete?: boolean
  isAdmin?: boolean
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
        {/* Show submitter username for admin */}
        {isAdmin && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium text-blue-600">ผู้ส่งคำขอ: {request.user.username}</span>
          </div>
        )}
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
      {canDelete && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onDelete?.(request.id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            ลบ
          </button>
        </div>
      )}
    </motion.div>
  )
}

const RenewalRequestCard = ({ 
  request, 
  onDelete, 
  onApprove,
  canDelete = false,
  isAdmin = false
}: { 
  request: RenewalRequest
  onDelete?: (id: string) => void
  onApprove?: (id: string, action: string) => void
  canDelete?: boolean
  isAdmin?: boolean
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            {request.domain.domainRequest.domain}
          </h3>
          <StatusBadge status={request.status} />
        </div>
        <RefreshCw className="w-8 h-8 text-blue-600" />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>ผู้ส่งคำขอ: {request.user.username}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>วันที่ส่งคำขอ: {formatDateTime(request.requestedAt)}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>วันหมดอายุเดิม: {request.domain.domainRequest.expiresAt ? formatDate(request.domain.domainRequest.expiresAt) : 'ไม่มี'}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium text-green-600">วันหมดอายุใหม่: {formatDate(request.newExpiryDate)}</span>
        </div>
      </div>
      
      {request.reason && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start">
            <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                เหตุผลในการต่ออายุ:
              </p>
              <p className="text-sm text-gray-600">
                {request.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(canDelete || (isAdmin && request.status === 'PENDING')) && (
        <div className="flex space-x-2 mt-4">
          {isAdmin && request.status === 'PENDING' && onApprove && (
            <>
              <button
                onClick={() => onApprove(request.id, 'approve')}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                อนุมัติ
              </button>
              <button
                onClick={() => onApprove(request.id, 'reject')}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                ไม่อนุมัติ
              </button>
            </>
          )}
          {canDelete && request.status === 'PENDING' && onDelete && (
            <button
              onClick={() => onDelete(request.id)}
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