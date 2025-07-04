# 🧑‍💻 Developer Guide

## การเริ่มต้นพัฒนา

### 1. ติดตั้งและเริ่มต้น
\`\`\`bash
# ติดตั้ง dependencies
npm install

# ตั้งค่าฐานข้อมูล
npm run db:push

# สร้างข้อมูลเริ่มต้น
npm run db:seed

# เริ่มต้น development server
npm run dev
\`\`\`

### 2. คำสั่งที่มีประโยชน์
\`\`\`bash
# ดูฐานข้อมูลด้วย Prisma Studio
npm run db:studio

# รีเซ็ตฐานข้อมูล
npm run db:reset

# รัน cleanup job
npm run cleanup

# Build สำหรับ production
npm run build
\`\`\`

## 🏗️ โครงสร้างโปรเจค

\`\`\`
fnon/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication pages
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and config
│   ├── types/             # TypeScript types
│   └── middleware.ts      # Route protection
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── scripts/              # Utility scripts
└── public/              # Static files
\`\`\`

## 🔄 การพัฒนาฟีเจอร์ใหม่

### 1. เพิ่มฟิลด์ใหม่ในฐานข้อมูล
\`\`\`prisma
// แก้ไขไฟล์ prisma/schema.prisma
model DomainRequest {
  // ... existing fields
  newField String?
}
\`\`\`

\`\`\`bash
# อัปเดตฐานข้อมูล
npm run db:push
\`\`\`

### 2. สร้าง API Route ใหม่
\`\`\`typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your logic here
  
  return NextResponse.json({ data: 'success' })
}
\`\`\`

### 3. สร้างหน้าใหม่
\`\`\`typescript
// src/app/new-page/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function NewPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div>
      {/* Your page content */}
    </div>
  )
}
\`\`\`

## 🎨 UI Components

### การใช้ Tailwind CSS
\`\`\`typescript
// ใช้ utility classes
className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"

// Responsive design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
\`\`\`

### Framer Motion Animations
\`\`\`typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
\`\`\`

### Lucide Icons
\`\`\`typescript
import { User, Check, X } from 'lucide-react'

<User className="w-5 h-5 text-gray-600" />
\`\`\`

## 🔐 Authentication

### การตรวจสอบ Session
\`\`\`typescript
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()

if (status === 'loading') return <div>Loading...</div>
if (!session) return <div>Not authenticated</div>

// Access user data
console.log(session.user.id)
console.log(session.user.role)
console.log(session.user.username)
\`\`\`

### การตรวจสอบสิทธิ์
\`\`\`typescript
// ตรวจสอบว่าเป็น Admin
if (session.user.role === 'ADMIN') {
  // Admin only logic
}

// ตรวจสอบเจ้าของข้อมูล
if (data.userId === session.user.id) {
  // Owner only logic
}
\`\`\`

## 📊 การทำงานกับฐานข้อมูล

### Basic Queries
\`\`\`typescript
// Find many with relations
const requests = await prisma.domainRequest.findMany({
  include: {
    user: true,
    domain_record: true
  },
  orderBy: {
    requestedAt: 'desc'
  }
})

// Find unique
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// Create
const newRequest = await prisma.domainRequest.create({
  data: {
    domain: 'example.com',
    userId: session.user.id
  }
})

// Update
await prisma.domainRequest.update({
  where: { id: requestId },
  data: { status: 'APPROVED' }
})
\`\`\`

### Transactions
\`\`\`typescript
await prisma.$transaction([
  prisma.domainRequest.update({
    where: { id: requestId },
    data: { status: 'APPROVED' }
  }),
  prisma.domain.create({
    data: {
      domainRequestId: requestId,
      status: 'ACTIVE'
    }
  })
])
\`\`\`

## 🐛 Debugging

### Console Logging
\`\`\`typescript
// Client-side
console.log('Client debug:', data)

// Server-side (API routes)
console.error('Server error:', error)
\`\`\`

### Network Debugging
- เปิด Developer Tools > Network
- ดู requests/responses
- ตรวจสอบ status codes

### Database Debugging
\`\`\`bash
# เปิด Prisma Studio
npm run db:studio

# ดู database file (SQLite)
# ไฟล์อยู่ที่ prisma/dev.db
\`\`\`

## 📱 Testing

### การทดสอบ API
\`\`\`bash
# ใช้ curl
curl -X GET http://localhost:3000/api/domains

# ใช้ Postman หรือ Insomnia
\`\`\`

### การทดสอบ UI
1. เปิดหน้าต่างๆ ในเบราว์เซอร์
2. ทดสอบการทำงานของฟอร์ม
3. ตรวจสอบ responsive design
4. ทดสอบกับผู้ใช้ต่างบทบาท

## 🚀 Deployment

### การเตรียมสำหรับ Production
1. เปลี่ยน SQLite เป็น PostgreSQL
2. ตั้งค่า environment variables
3. ทำ build และ test
4. ตั้งค่า cron job สำหรับ cleanup

### Environment Variables
\`\`\`env
# Development
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"

# Production
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key"
\`\`\`

## 📝 Code Style

### TypeScript
- ใช้ strict typing
- หลีกเลี่ยง \`any\`
- สร้าง interfaces สำหรับ data structures

### React
- ใช้ functional components
- ใช้ hooks สำหรับ state management
- แยก logic ออกจาก UI

### CSS
- ใช้ Tailwind classes
- สร้าง reusable components
- ใช้ consistent spacing

## 🔧 Troubleshooting

### Common Issues
1. **Port already in use**: Next.js จะเปลี่ยนเป็น port อื่นอัตโนมัติ
2. **Database connection**: ตรวจสอบ DATABASE_URL
3. **Authentication**: ตรวจสอบ NEXTAUTH_SECRET
4. **Middleware**: ตรวจสอบ cookie names

### Performance Tips
- ใช้ React.memo สำหรับ components ที่ไม่ต้อง re-render บ่อย
- ใช้ useMemo และ useCallback เมื่อจำเป็น
- Optimize database queries
- ใช้ loading states

---

Happy coding! 🚀
