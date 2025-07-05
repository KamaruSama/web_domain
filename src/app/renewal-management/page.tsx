'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Globe,
  User,
  FileText,
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Settings2
} from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
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
      domain: string
      durationType: string
      expiresAt: string | null
      requesterName: string
      department: string
    }
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

export default function RenewalManagementPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [renewalRequests, setRenewalRequests] = useState<RenewalRequest[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    sortBy: 'requestedAt',
    sortOrder: 'desc'
  })

  useEffect(() => {
    if (session) {
      fetchRenewalRequests()
    }
  }, [session])

  const fetchRenewalRequests = async () => {
    try {
      const response = await fetch('/api/renewal-requests')
      if (response.ok) {
        const data = await response.json()
        setRenewalRequests(data)
      }
    } catch (error) {
      console.error('Error fetching renewal requests:', error)
    } finally {
      setLoading(false)
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

  const handleApproveRequest = async (requestId: string, action: string) => {
    const confirmMessage = action === 'approve' 
      ? 'คุณแน่ใจหรือไม่ที่จะอนุมัติคำขอต่ออายุนี้?'
      : 'คุณแน่ใจหรือไม่ที่จะไม่อนุมัติคำขอต่ออายุนี้?'
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/renewal-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        const message = action === 'approve' 
          ? 'อนุมัติคำขอต่ออายุสำเร็จ' 
          : 'ไม่อนุมัติคำขอต่ออายุสำเร็จ'
        alert(message)
        fetchRenewalRequests()
      } else {
        const error = await response.json()
        alert(`เกิดข้อผิดพลาด: ${error.error}`)
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

  // Filter and sort renewal requests
  const filteredRequests = renewalRequests.filter(request => {
    const matchesSearch = request.domain.domainRequest.domain.toLowerCase().includes(filters.search.toLowerCase()) ||
                         request.user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
                         request.domain.domainRequest.department.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = filters.status === 'ALL' || request.status === filters.status
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    const field = filters.sortBy
    let aValue = ''
    let bValue = ''
    
    switch (field) {
      case 'domain':
        aValue = a.domain.domainRequest.domain
        bValue = b.domain.domainRequest.domain
        break
      case 'username':
        aValue = a.user.username
        bValue = b.user.username
        break
      case 'requestedAt':
        aValue = a.requestedAt
        bValue = b.requestedAt
        break
      case 'newExpiryDate':
        aValue = a.newExpiryDate
        bValue = b.newExpiryDate
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            กรองข้อมูล
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="w-4 h-4 mr-1" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Settings2 className="w-4 h-4 mr-1" />
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

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <SortAsc className="w-4 h-4 mr-1" />
                เรียงตาม
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="requestedAt">วันที่ขอ</option>
                <option value="domain">ชื่อโดเมน</option>
                <option value="username">ผู้ขอ</option>
                <option value="newExpiryDate">วันหมดอายุใหม่</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                {filters.sortOrder === 'desc' ? 
                  <SortDesc className="w-4 h-4 mr-1" /> : 
                  <SortAsc className="w-4 h-4 mr-1" />
                }
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
              แสดงผล {filteredRequests.length} จาก {renewalRequests.length} รายการ
              {filters.search && ` | ค้นหา: "${filters.search}"`}
              {filters.status !== 'ALL' && ` | สถานะ: ${filters.status}`}
            </p>
          </div>
        </div>
        
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

        {/* Renewal Requests Sections */}
        <div className="space-y-8">
          {/* Pending Requests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              คำขอต่ออายุรอพิจารณา ({pendingRequests.length})
            </h2>
            
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีคำขอต่ออายุรอพิจารณา</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => (
                  <RenewalRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApproveRequest}
                    showActionButtons={true}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Approved Requests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              คำขอต่ออายุที่อนุมัติแล้ว ({approvedRequests.length})
            </h2>
            
            {approvedRequests.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีคำขอต่ออายุที่อนุมัติแล้ว</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {approvedRequests.map((request) => (
                  <RenewalRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApproveRequest}
                    showActionButtons={false}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Rejected Requests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              คำขอต่ออายุที่ไม่อนุมัติ ({rejectedRequests.length})
            </h2>
            
            {rejectedRequests.length === 0 ? (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีคำขอต่ออายุที่ไม่อนุมัติ</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rejectedRequests.map((request) => (
                  <RenewalRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApproveRequest}
                    showActionButtons={false}
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

const RenewalRequestCard = ({ 
  request, 
  onApprove, 
  showActionButtons = false
}: { 
  request: RenewalRequest
  onApprove: (id: string, action: string) => void
  showActionButtons?: boolean
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
        <Globe className="w-8 h-8 text-blue-600" />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>ผู้ส่งคำขอ: {request.user.username}</span>
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>ผู้ขอ: {request.domain.domainRequest.requesterName}</span>
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
      {showActionButtons && (
        <div className="flex space-x-2 mt-4">
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
        </div>
      )}
    </motion.div>
  )
}