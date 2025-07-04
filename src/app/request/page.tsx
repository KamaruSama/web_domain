'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Globe, 
  User, 
  Building, 
  Mail, 
  Calendar, 
  Clock, 
  Check, 
  X,
  Eye,
  EyeOff,
  Plus,
  AlertCircle,
  CheckCircle
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

export default function RequestPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<DomainRequest[]>([])
  const [showHidden, setShowHidden] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    domain: '',
    purpose: '',
    ipAddress: '',
    requesterName: '',
    responsibleName: '',
    department: '',
    contact: '',
    durationType: 'PERMANENT',
    expiresAt: ''
  })

  useEffect(() => {
    if (session) {
      fetchRequests()
    }
  }, [session])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          domain: '',
          purpose: '',
          ipAddress: '',
          requesterName: '',
          responsibleName: '',
          department: '',
          contact: '',
          durationType: 'PERMANENT',
          expiresAt: ''
        })
        setShowForm(false)
        fetchRequests()
      } else {
        const error = await response.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการส่งคำขอ')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('เกิดข้อผิดพลาดในการส่งคำขอ')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isHidden = (request: DomainRequest) => {
    if (!request.approvalCooldownAt) return false
    const now = new Date()
    const cooldownEnd = new Date(request.approvalCooldownAt)
    return now < cooldownEnd
  }

  const visibleRequests = requests.filter(request => !isHidden(request))
  const hiddenRequests = requests.filter(request => isHidden(request))

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
              <h1 className="text-2xl font-bold text-gray-900">ขอใช้โดเมน</h1>
              <p className="text-gray-600">ส่งคำขอใช้โดเมนใหม่</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                หน้าแรก
              </Link>
              <Link href="/my-tickets" className="text-gray-600 hover:text-gray-900">
                คำขอของฉัน
              </Link>
              {session.user.role === 'ADMIN' && (
                <>
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                    จัดการระบบ
                  </Link>
                  <button
                    onClick={() => setShowHidden(!showHidden)}
                    className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {showHidden ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showHidden ? 'ซ่อนการ์ดที่ซ่อนไว้' : 'แสดงการ์ดที่ซ่อนไว้'}
                  </button>
                </>
              )}
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                ขอใช้โดเมนใหม่
              </button>
              <Link
                href="/change-password"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                เปลี่ยนรหัสผ่าน
              </Link>
              <LogoutButton className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Request Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ฟอร์มขอใช้โดเมน</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อโดเมน *
                  </label>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    required
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example.nstru.ac.th"
                  />
                </div>

                <div>
                  <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    IP Address *
                  </label>
                  <input
                    type="text"
                    id="ipAddress"
                    name="ipAddress"
                    required
                    value={formData.ipAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.100"
                  />
                </div>

                <div>
                  <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-สกุลผู้ขอ *
                  </label>
                  <input
                    type="text"
                    id="requesterName"
                    name="requesterName"
                    required
                    value={formData.requesterName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="นายสมชาย ใจดี"
                  />
                </div>

                <div>
                  <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-สกุลผู้รับผิดชอบ *
                  </label>
                  <input
                    type="text"
                    id="responsibleName"
                    name="responsibleName"
                    required
                    value={formData.responsibleName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="นายสมศักดิ์ รักษาดี"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    หน่วยงาน *
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ห้องสมุดกลาง"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    ช่องทางติดต่อ *
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@nstru.ac.th"
                  />
                </div>

                <div>
                  <label htmlFor="durationType" className="block text-sm font-medium text-gray-700 mb-2">
                    ระยะเวลาการใช้งาน *
                  </label>
                  <select
                    id="durationType"
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERMANENT">ถาวร</option>
                    <option value="TEMPORARY">ชั่วคราว</option>
                  </select>
                </div>

                {formData.durationType === 'TEMPORARY' && (
                  <div>
                    <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                      วันหมดอายุ *
                    </label>
                    <input
                      type="date"
                      id="expiresAt"
                      name="expiresAt"
                      required
                      value={formData.expiresAt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  วัตถุประสงค์ *
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  required
                  rows={3}
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="อธิบายวัตถุประสงค์ในการใช้โดเมน"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? 'กำลังส่ง...' : 'ส่งคำขอ'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Requests List */}
        <div className="space-y-8">
          {/* Visible Requests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              คำขอที่ส่งแล้ว ({visibleRequests.length})
            </h2>
            
            {visibleRequests.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ยังไม่มีคำขอ</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </section>

          {/* Hidden Requests (Admin only) */}
          {session.user.role === 'ADMIN' && showHidden && hiddenRequests.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                คำขอที่ซ่อนไว้ ({hiddenRequests.length})
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hiddenRequests.map((request) => (
                  <RequestCard key={request.id} request={request} isHidden={true} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

const RequestCard = ({ request, isHidden = false }: { request: DomainRequest, isHidden?: boolean }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCooldownTimeLeft = (cooldownAt: string | null) => {
    if (!cooldownAt) return 0
    const now = new Date()
    const cooldown = new Date(cooldownAt)
    const diffTime = cooldown.getTime() - now.getTime()
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    return Math.max(0, diffMinutes)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${
        isHidden ? 'border-l-4 border-orange-500 bg-orange-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {request.domain}
          </h3>
          <StatusBadge status={request.status} />
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
          <p className="text-sm text-gray-500">
            หมดอายุ: {formatDate(request.expiresAt)}
          </p>
        )}
      </div>

      {isHidden && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <div className="flex items-center text-sm text-orange-600 font-medium">
            <Clock className="w-4 h-4 mr-2" />
            ซ่อนอีก {getCooldownTimeLeft(request.approvalCooldownAt)} นาที
          </div>
        </div>
      )}
    </motion.div>
  )
}
