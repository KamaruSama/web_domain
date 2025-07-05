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
import NavigationBar from '@/components/NavigationBar'
import Link from 'next/link'

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
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    durationType: 'ALL',
    sortBy: 'requestedAt',
    sortOrder: 'desc'
  })

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter and sort requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.domain.toLowerCase().includes(filters.search.toLowerCase()) ||
                         request.requesterName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         request.department.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = filters.status === 'ALL' || request.status === filters.status
    const matchesDurationType = filters.durationType === 'ALL' || request.durationType === filters.durationType
    
    return matchesSearch && matchesStatus && matchesDurationType
  }).sort((a, b) => {
    const field = filters.sortBy
    let aValue = ''
    let bValue = ''
    
    switch (field) {
      case 'domain':
        aValue = a.domain
        bValue = b.domain
        break
      case 'requesterName':
        aValue = a.requesterName
        bValue = b.requesterName
        break
      case 'department':
        aValue = a.department
        bValue = b.department
        break
      case 'requestedAt':
        aValue = a.requestedAt
        bValue = b.requestedAt
        break
      default:
        aValue = a.requestedAt
        bValue = b.requestedAt
    }
    
    if (filters.sortOrder === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const pendingRequests = filteredRequests.filter(r => r.status === 'PENDING')
  const approvedRequests = filteredRequests.filter(r => r.status === 'APPROVED')
  const rejectedRequests = filteredRequests.filter(r => r.status === 'REJECTED')

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
      {/* Navigation */}
      <NavigationBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">กรองข้อมูล</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="ชื่อโดเมน, ผู้ขอ, หน่วยงาน..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="PENDING">รอพิจารณา</option>
                <option value="APPROVED">อนุมัติ</option>
                <option value="REJECTED">ปฏิเสธ</option>
              </select>
            </div>

            {/* Duration Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภท
              </label>
              <select
                value={filters.durationType}
                onChange={(e) => setFilters(prev => ({ ...prev, durationType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="PERMANENT">ถาวร</option>
                <option value="TEMPORARY">ชั่วคราว</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เรียงตาม
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="requestedAt">วันที่ขอ</option>
                <option value="domain">ชื่อโดเมน</option>
                <option value="requesterName">ผู้ขอ</option>
                <option value="department">หน่วยงาน</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ลำดับ
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">ใหม่ไปเก่า</option>
                <option value="asc">เก่าไปใหม่</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              แสดงผล {filteredRequests.length} จาก {requests.length} รายการ
              {filters.search && ` | ค้นหา: "${filters.search}"`}
              {filters.status !== 'ALL' && ` | สถานะ: ${filters.status}`}
              {filters.durationType !== 'ALL' && ` | ประเภท: ${filters.durationType}`}
            </p>
          </div>
        </div>
        
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