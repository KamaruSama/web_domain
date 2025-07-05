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
  XCircle
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
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

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบโดเมนนี้?')) return
    
    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchDomains() // Refresh the list
      } else {
        alert('เกิดข้อผิดพลาดในการลบโดเมน')
      }
    } catch (error) {
      console.error('Delete Error:', error)
      alert('เกิดข้อผิดพลาดในการลบโดเมน')
    }
  }

  const activeDomains = domains.filter(d => d.status === 'ACTIVE')
  const trashedDomains = domains.filter(d => d.status === 'TRASHED')

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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ระบบขอใช้โดเมน</h1>
              <p className="text-gray-600">มหาวิทยาลัยราชภัฏนครศรีธรรมราช</p>
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
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      คำขอของฉัน
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        จัดการระบบ
                      </Link>
                    )}
                    <Link
                      href="/change-password"
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      เปลี่ยนรหัสผ่าน
                    </Link>
                    <LogoutButton className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors" />
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Buttons for logged in users */}
        {session && (
          <div className="mb-8 flex justify-center">
            <Link
              href="/request"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ขอใช้โดเมนใหม่
            </Link>
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
                  isTrashed={true}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

interface DomainCardProps {
  domain: Domain
  isGuest: boolean
  isAdmin: boolean
  onDelete: (domainId: string) => void
  isTrashed?: boolean
}

const DomainCard = ({ domain, isGuest, isAdmin, onDelete, isTrashed = false }: DomainCardProps) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  
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
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      {/* Delete Button for Admin */}
      {isAdmin && showDeleteButton && !isTrashed && (
        <button
          onClick={() => onDelete(domain.id)}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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
