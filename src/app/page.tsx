'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Clock, 
  Trash2, 
  RefreshCw, 
  User, 
  Building, 
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  RotateCcw,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Settings2
} from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Link from 'next/link'

interface Domain {
  id: string
  domainRequest: {
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
    user: {
      username: string
    }
  }
  status: string
  lastUsedAt: string | null
  deletedAt: string | null
  trashExpiresAt: string | null
}

const StatusBadge = ({ status }: { status: string }) => {
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

export default function HomePage() {
  const { data: session } = useSession()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showRenewalModal, setShowRenewalModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    durationType: 'ALL',
    sortBy: 'requestedAt',
    sortOrder: 'desc'
  })
  
  const [restoreData, setRestoreData] = useState({
    durationType: 'PERMANENT',
    expiresAt: ''
  })
  const [renewalData, setRenewalData] = useState({
    domainId: '',
    newExpiryDate: '',
    reason: ''
  })
  const [requestData, setRequestData] = useState({
    domain: '',
    purpose: '',
    ipAddress: '',
    requesterName: '',
    responsibleName: '',
    department: '',
    contact: '',
    contactType: 'EMAIL',
    durationType: 'PERMANENT',
    expiresAt: ''
  })

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains')
      
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
      } else {
        console.error('API Error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Fetch Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDomain = async (domainId: string, domainName: string, isInTrash: boolean) => {
    const confirmMessage = isInTrash 
      ? `คุณแน่ใจหรือไม่ที่จะลบโดเมน "${domainName}" ถาวร? การดำเนินการนี้ไม่สามารถยกเลิกได้!`
      : `คุณแน่ใจหรือไม่ที่จะย้ายโดเมน "${domainName}" ไปยังถังขยะ?`
    
    if (!confirm(confirmMessage)) return
    
    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Show appropriate message based on action
        if (result.action === 'moved_to_trash') {
          alert(`โดเมน "${domainName}" ถูกย้ายไปยังถังขยะแล้ว`)
        } else if (result.action === 'permanently_deleted') {
          alert(`โดเมน "${domainName}" ถูกลบถาวรแล้ว`)
        }
        
        fetchDomains() // Refresh the list
      } else {
        const error = await response.json()
        alert(`เกิดข้อผิดพลาด: ${error.error}`)
      }
    } catch (error) {
      console.error('Delete Error:', error)
      alert('เกิดข้อผิดพลาดในการลบโดเมน')
    }
  }

  const handleRestoreDomain = async (domainId: string, domainName: string) => {
    // Find the domain to restore
    const domain = domains.find(d => d.id === domainId)
    if (!domain) {
      alert('ไม่พบโดเมนที่ต้องการกู้คืน')
      return
    }
    
    // Set selected domain and show modal
    setSelectedDomain(domain)
    setRestoreData({
      durationType: domain.domainRequest.durationType, // Use original type as default
      expiresAt: domain.domainRequest.expiresAt ? 
        new Date(domain.domainRequest.expiresAt).toISOString().split('T')[0] : ''
    })
    setShowRestoreModal(true)
  }

  const handleRestoreSubmit = async () => {
    if (!selectedDomain) return
    
    // Validate expiry date for temporary domains
    if (restoreData.durationType === 'TEMPORARY' && !restoreData.expiresAt) {
      alert('กรุณาระบุวันหมดอายุสำหรับโดเมนชั่วคราว')
      return
    }
    
    try {
      const response = await fetch(`/api/domains/${selectedDomain.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'restore',
          durationType: restoreData.durationType,
          expiresAt: restoreData.durationType === 'TEMPORARY' ? restoreData.expiresAt : null
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        
        if (result.action === 'restored') {
          const typeText = restoreData.durationType === 'PERMANENT' ? 'ถาวร' : 'ชั่วคราว'
          const expiryText = restoreData.durationType === 'TEMPORARY' && restoreData.expiresAt 
            ? ` (หมดอายุ: ${new Date(restoreData.expiresAt).toLocaleDateString('th-TH')})` 
            : ''
          alert(`โดเมน "${selectedDomain.domainRequest.domain}" ถูกกู้คืนเป็นประเภท${typeText}${expiryText}แล้ว`)
        }
        
        // Reset modal state
        setShowRestoreModal(false)
        setSelectedDomain(null)
        setRestoreData({ durationType: 'PERMANENT', expiresAt: '' })
        
        fetchDomains() // Refresh the list
      } else {
        const error = await response.json()
        alert(`เกิดข้อผิดพลาด: ${error.error}`)
      }
    } catch (error) {
      console.error('Restore Error:', error)
      alert('เกิดข้อผิดพลาดในการกู้คืนโดเมน')
    }
  }

  const handleRestoreDataChange = (field: string, value: string) => {
    setRestoreData(prev => ({
      ...prev,
      [field]: value,
      // Reset expiresAt when changing to PERMANENT
      ...(field === 'durationType' && value === 'PERMANENT' && { expiresAt: '' })
    }))
  }

  const handleRestoreCancel = () => {
    setShowRestoreModal(false)
    setSelectedDomain(null)
    setRestoreData({ durationType: 'PERMANENT', expiresAt: '' })
  }

  const handleRenewDomain = async (domainId: string, domainName: string) => {
    const domain = domains.find(d => d.id === domainId)
    if (!domain) {
      alert('ไม่พบโดเมนที่ต้องการต่ออายุ')
      return
    }

    setRenewalData({
      domainId: domainId,
      newExpiryDate: '',
      reason: ''
    })
    setShowRenewalModal(true)
  }

  const handleRenewalSubmit = async () => {
    if (!renewalData.domainId || !renewalData.newExpiryDate) {
      alert('กรุณาระบุข้อมูลให้ครบถ้วน')
      return
    }

    // Validate date is in the future
    if (new Date(renewalData.newExpiryDate) <= new Date()) {
      alert('วันหมดอายุใหม่ต้องเป็นวันที่ในอนาคต')
      return
    }

    try {
      const response = await fetch('/api/renewal-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domainId: renewalData.domainId,
          newExpiryDate: renewalData.newExpiryDate,
          reason: renewalData.reason
        })
      })

      if (response.ok) {
        alert('ส่งคำขอต่ออายุสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ')
        setShowRenewalModal(false)
        setRenewalData({ domainId: '', newExpiryDate: '', reason: '' })
      } else {
        const error = await response.json()
        alert(`เกิดข้อผิดพลาด: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting renewal request:', error)
      alert('เกิดข้อผิดพลาดในการส่งคำขอต่ออายุ')
    }
  }

  const handleRenewalCancel = () => {
    setShowRenewalModal(false)
    setRenewalData({ domainId: '', newExpiryDate: '', reason: '' })
  }

  const handleRequestSubmit = async () => {
    // Validate required fields
    if (!requestData.domain || !requestData.purpose || !requestData.ipAddress || 
        !requestData.requesterName || !requestData.responsibleName || 
        !requestData.department || !requestData.contact) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    // Validate expiry date for temporary domains
    if (requestData.durationType === 'TEMPORARY' && !requestData.expiresAt) {
      alert('กรุณาระบุวันหมดอายุสำหรับโดเมนชั่วคราว')
      return
    }

    if (requestData.durationType === 'TEMPORARY' && new Date(requestData.expiresAt) <= new Date()) {
      alert('วันหมดอายุต้องเป็นวันที่ในอนาคต')
      return
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: requestData.domain,
          purpose: requestData.purpose,
          ipAddress: requestData.ipAddress,
          requesterName: requestData.requesterName,
          responsibleName: requestData.responsibleName,
          department: requestData.department,
          contact: requestData.contact,
          contactType: requestData.contactType,
          durationType: requestData.durationType,
          expiresAt: requestData.durationType === 'TEMPORARY' ? requestData.expiresAt : null
        })
      })

      if (response.ok) {
        alert('ส่งคำขอใช้โดเมนสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ')
        setShowRequestModal(false)
        setRequestData({
          domain: '',
          purpose: '',
          ipAddress: '',
          requesterName: '',
          responsibleName: '',
          department: '',
          contact: '',
          contactType: 'EMAIL',
          durationType: 'PERMANENT',
          expiresAt: ''
        })
      } else {
        const error = await response.json()
        alert(`เกิดข้อผิดพลาด: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('เกิดข้อผิดพลาดในการส่งคำขอ')
    }
  }

  const handleRequestCancel = () => {
    setShowRequestModal(false)
    setRequestData({
      domain: '',
      purpose: '',
      ipAddress: '',
      requesterName: '',
      responsibleName: '',
      department: '',
      contact: '',
      contactType: 'EMAIL',
      durationType: 'PERMANENT',
      expiresAt: ''
    })
  }

  const handleRequestDataChange = (field: string, value: string) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value,
      // Reset expiresAt when changing to PERMANENT
      ...(field === 'durationType' && value === 'PERMANENT' && { expiresAt: '' })
    }))
  }

  // Filter and sort domains
  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.domainRequest.domain.toLowerCase().includes(filters.search.toLowerCase()) ||
                         domain.domainRequest.requesterName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         domain.domainRequest.department.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = filters.status === 'ALL' || domain.status === filters.status
    const matchesDurationType = filters.durationType === 'ALL' || domain.domainRequest.durationType === filters.durationType
    
    return matchesSearch && matchesStatus && matchesDurationType
  }).sort((a, b) => {
    const field = filters.sortBy
    let aValue = ''
    let bValue = ''
    
    switch (field) {
      case 'domain':
        aValue = a.domainRequest.domain
        bValue = b.domainRequest.domain
        break
      case 'requesterName':
        aValue = a.domainRequest.requesterName
        bValue = b.domainRequest.requesterName
        break
      case 'department':
        aValue = a.domainRequest.department
        bValue = b.domainRequest.department
        break
      case 'requestedAt':
        aValue = a.domainRequest.requestedAt
        bValue = b.domainRequest.requestedAt
        break
      default:
        aValue = a.domainRequest.requestedAt
        bValue = b.domainRequest.requestedAt
    }
    
    if (filters.sortOrder === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const activeDomains = filteredDomains.filter(d => d.status === 'ACTIVE')
  const expiredDomains = filteredDomains.filter(d => d.status === 'EXPIRED')
  const trashedDomains = filteredDomains.filter(d => d.status === 'TRASHED')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilDeletion = (trashExpiresAt: string | null) => {
    if (!trashExpiresAt) return 0
    const now = new Date()
    const expiry = new Date(trashExpiresAt)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
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
      <NavigationBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Action buttons */}
        {session && (
          <div className="flex space-x-2 mb-8">
            <button
              onClick={() => setShowRenewalModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              ขอต่ออายุ
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              ขอใช้โดเมนใหม่
            </button>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            กรองข้อมูล
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <option value="ACTIVE">ใช้งาน</option>
                <option value="EXPIRED">หมดอายุ</option>
                {session?.user.role === 'ADMIN' && <option value="TRASHED">ในถังขยะ</option>}
              </select>
            </div>

            {/* Duration Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
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
                <option value="requesterName">ผู้ขอ</option>
                <option value="department">หน่วยงาน</option>
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
              แสดงผล {filteredDomains.length} จาก {domains.length} รายการ
              {filters.search && ` | ค้นหา: "${filters.search}"`}
              {filters.status !== 'ALL' && ` | สถานะ: ${filters.status}`}
              {filters.durationType !== 'ALL' && ` | ประเภท: ${filters.durationType}`}
            </p>
          </div>
        </div>

        {/* Request Form Button for non-logged in users */}
        {!session && (
          <div className="text-center mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                ต้องการขอใช้โดเมน?
              </h3>
              <p className="text-blue-700 mb-4">
                กรุณาเข้าสู่ระบบเพื่อส่งคำขอใช้โดเมน หรือติดต่อผู้ดูแลระบบ
              </p>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}

        {/* Active Domains Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            โดเมนที่ใช้งานอยู่ ({activeDomains.length})
          </h2>
          
          {activeDomains.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ยังไม่มีโดเมนที่ใช้งานอยู่</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  isGuest={!session}
                  isAdmin={session?.user.role === 'ADMIN'}
                  onDelete={handleDeleteDomain}
                />
              ))}
            </div>
          )}
        </section>

        {/* Expired Domains Section */}
        {expiredDomains.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
              โดเมนหมดอายุ ({expiredDomains.length})
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {expiredDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  isGuest={!session}
                  isAdmin={session?.user.role === 'ADMIN'}
                  onDelete={handleDeleteDomain}
                  onRenew={handleRenewDomain}
                  showRenewButton={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trashed Domains Section - Only for Admin */}
        {session?.user.role === 'ADMIN' && trashedDomains.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-600" />
              โดเมนรอการลบถาวร ({trashedDomains.length})
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trashedDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  isGuest={false}
                  isAdmin={true}
                  onDelete={handleDeleteDomain}
                  onRestore={handleRestoreDomain}
                  isTrashed={true}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Restore Modal */}
      {showRestoreModal && selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              กู้คืนโดเมน
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                โดเมน: <span className="font-medium">{selectedDomain.domainRequest.domain}</span>
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500 mb-1">ข้อมูลเดิม:</p>
                <p className="text-sm">
                  ประเภท: <span className="font-medium">
                    {selectedDomain.domainRequest.durationType === 'PERMANENT' ? 'ถาวร' : 'ชั่วคราว'}
                  </span>
                </p>
                {selectedDomain.domainRequest.expiresAt && (
                  <p className="text-sm">
                    หมดอายุ: <span className="font-medium">
                      {new Date(selectedDomain.domainRequest.expiresAt).toLocaleDateString('th-TH')}
                    </span>
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-600">
                กรุณาเลือกประเภทการใช้งานสำหรับโดเมนที่กู้คืน
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทการใช้งาน *
                </label>
                <select
                  value={restoreData.durationType}
                  onChange={(e) => handleRestoreDataChange('durationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PERMANENT">ถาวร</option>
                  <option value="TEMPORARY">ชั่วคราว</option>
                </select>
              </div>

              {restoreData.durationType === 'TEMPORARY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วันหมดอายุ *
                  </label>
                  <input
                    type="date"
                    value={restoreData.expiresAt}
                    onChange={(e) => handleRestoreDataChange('expiresAt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleRestoreCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRestoreSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                กู้คืน
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ขอใช้โดเมนใหม่
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อโดเมน *
                  </label>
                  <input
                    type="text"
                    value={requestData.domain}
                    onChange={(e) => handleRequestDataChange('domain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example.nstru.ac.th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Address *
                  </label>
                  <input
                    type="text"
                    value={requestData.ipAddress}
                    onChange={(e) => handleRequestDataChange('ipAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วัตถุประสงค์ *
                </label>
                <textarea
                  value={requestData.purpose}
                  onChange={(e) => handleRequestDataChange('purpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="ระบุวัตถุประสงค์ในการใช้งาน"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อผู้ขอ *
                  </label>
                  <input
                    type="text"
                    value={requestData.requesterName}
                    onChange={(e) => handleRequestDataChange('requesterName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="นายสมชาย ใจดี"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อผู้รับผิดชอบ *
                  </label>
                  <input
                    type="text"
                    value={requestData.responsibleName}
                    onChange={(e) => handleRequestDataChange('responsibleName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="นายสมศักดิ์ รักษา"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หน่วยงาน/ภาควิชา *
                </label>
                <input
                  type="text"
                  value={requestData.department}
                  onChange={(e) => handleRequestDataChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ภาควิชาวิทยาการคอมพิวเตอร์"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อมูลติดต่อ *
                  </label>
                  <input
                    type="text"
                    value={requestData.contact}
                    onChange={(e) => handleRequestDataChange('contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com หรือ 081-234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทการติดต่อ *
                  </label>
                  <select
                    value={requestData.contactType}
                    onChange={(e) => handleRequestDataChange('contactType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EMAIL">อีเมล</option>
                    <option value="PHONE">โทรศัพท์</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทการใช้งาน *
                  </label>
                  <select
                    value={requestData.durationType}
                    onChange={(e) => handleRequestDataChange('durationType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERMANENT">ถาวร</option>
                    <option value="TEMPORARY">ชั่วคราว</option>
                  </select>
                </div>

                {requestData.durationType === 'TEMPORARY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      วันหมดอายุ *
                    </label>
                    <input
                      type="date"
                      value={requestData.expiresAt}
                      onChange={(e) => handleRequestDataChange('expiresAt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleRequestCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRequestSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ส่งคำขอ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ขอต่ออายุโดเมน
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกโดเมนที่ต้องการต่ออายุ *
                </label>
                <select
                  value={renewalData.domainId}
                  onChange={(e) => setRenewalData(prev => ({ ...prev, domainId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- เลือกโดเมน --</option>
                  {[...activeDomains, ...expiredDomains, ...trashedDomains]
                    .filter(domain => domain.domainRequest.durationType !== 'PERMANENT') // ไม่แสดงโดเมนถาวร
                    .map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.domainRequest.domain} 
                      {domain.status === 'EXPIRED' ? ' (หมดอายุ)' : ''}
                      {domain.status === 'TRASHED' ? ' (ในถังขยะ)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันหมดอายุใหม่ *
                </label>
                <input
                  type="date"
                  value={renewalData.newExpiryDate}
                  onChange={(e) => setRenewalData(prev => ({ ...prev, newExpiryDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เหตุผลในการต่ออายุ
                </label>
                <textarea
                  value={renewalData.reason}
                  onChange={(e) => setRenewalData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="ระบุเหตุผล (ไม่บังคับ)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleRenewalCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRenewalSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ส่งคำขอ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface DomainCardProps {
  domain: Domain
  isGuest: boolean
  isAdmin: boolean
  onDelete: (domainId: string, domainName: string, isInTrash: boolean) => void
  onRestore?: (domainId: string, domainName: string) => void
  onRenew?: (domainId: string, domainName: string) => void
  isTrashed?: boolean
  showRenewButton?: boolean
}

const DomainCard = ({ domain, isGuest, isAdmin, onDelete, onRestore, onRenew, isTrashed = false, showRenewButton = false }: DomainCardProps) => {
  const [showActionButtons, setShowActionButtons] = useState(false)
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilDeletion = (trashExpiresAt: string | null) => {
    if (!trashExpiresAt) return 0
    const now = new Date()
    const expiry = new Date(trashExpiresAt)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative ${
        isTrashed ? 'border-l-4 border-red-500' : ''
      }`}
      onMouseEnter={() => setShowActionButtons(true)}
      onMouseLeave={() => setShowActionButtons(false)}
    >
      {/* Action Buttons for Admin */}
      {isAdmin && showActionButtons && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {/* Restore Button (only for trashed domains) */}
          {isTrashed && onRestore && (
            <button
              onClick={() => onRestore(domain.id, domain.domainRequest.domain)}
              className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors z-10"
              title="กู้คืน"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Renew Button (only for expired domains) */}
          {showRenewButton && onRenew && (
            <button
              onClick={() => onRenew(domain.id, domain.domainRequest.domain)}
              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors z-10"
              title="ขอต่ออายุ"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          
          {/* Delete Button */}
          <button
            onClick={() => onDelete(domain.id, domain.domainRequest.domain, isTrashed)}
            className={`w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors z-10 ${
              isTrashed 
                ? 'bg-red-800 hover:bg-red-900' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isTrashed ? 'ลบถาวร' : 'ย้ายไปถังขยะ'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Renew Button for regular users on expired domains */}
      {!isAdmin && showRenewButton && onRenew && (
        <div className="absolute -top-2 -right-2">
          <button
            onClick={() => onRenew(domain.id, domain.domainRequest.domain)}
            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors z-10"
            title="ขอต่ออายุ"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {domain.domainRequest.domain}
          </h3>
          <StatusBadge status={domain.status} />
        </div>
        {isTrashed ? (
          <Trash2 className="w-8 h-8 text-red-600" />
        ) : (
          <Globe className="w-8 h-8 text-blue-600" />
        )}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        {/* Show IP Address for all users */}
        <div className="flex items-center">
          <span className="w-4 h-4 mr-2 text-gray-400">IP:</span>
          <span className="font-medium">{domain.domainRequest.ipAddress}</span>
        </div>
        
        {/* Show detailed info only for logged in users */}
        {!isGuest && (
          <>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {domain.domainRequest.requesterName}
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {domain.domainRequest.department}
            </div>
            <div className="flex items-center">
              {domain.domainRequest.contactType === 'EMAIL' ? (
                <Mail className="w-4 h-4 mr-2" />
              ) : (
                <Phone className="w-4 h-4 mr-2" />
              )}
              {domain.domainRequest.contact}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {isTrashed && domain.deletedAt ? (
                <>ลบเมื่อ: {formatDate(domain.deletedAt)}</>
              ) : (
                formatDate(domain.domainRequest.requestedAt)
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Show purpose only for logged in users */}
      {!isGuest && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 font-medium mb-2">
            วัตถุประสงค์:
          </p>
          <p className="text-sm text-gray-600">
            {domain.domainRequest.purpose}
          </p>
        </div>
      )}
      
      {/* Show additional info only for logged in users */}
      {!isGuest && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ประเภท: {domain.domainRequest.durationType === 'PERMANENT' ? 'ถาวร' : 'ชั่วคราว'}
          </p>
          {domain.domainRequest.expiresAt && (
            <p className="text-sm text-gray-500">
              หมดอายุ: {formatDate(domain.domainRequest.expiresAt)}
            </p>
          )}
        </div>
      )}

      {/* Show trash expiry info for admin */}
      {isTrashed && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-red-600 font-medium">
            <Clock className="w-4 h-4 mr-2" />
            ลบถาวรใน {getDaysUntilDeletion(domain.trashExpiresAt)} วัน
          </div>
        </div>
      )}
    </motion.div>
  )
}
