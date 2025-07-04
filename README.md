# ระบบขอใช้โดเมน - มหาวิทยาลัยราชภัฏนครศรีธรรมราช

ระบบจัดการคำขอใช้ชื่อโดเมนสำหรับมหาวิทยาลัยราชภัฏนครศรีธรรมราช พัฒนาด้วย Next.js 14+ และ TypeScript

## 🚀 เทคโนโลยีที่ใช้

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS 4.0** (Light Theme)
- **Prisma ORM** + **SQLite**
- **NextAuth.js** (Authentication)
- **Framer Motion** (Animations)
- **Lucide Icons**

## 📋 คุณสมบัติหลัก

### 👥 ระบบผู้ใช้
- เข้าสู่ระบบด้วย Username + Password
- ไม่มีระบบสมัครสมาชิก (Admin เพิ่มผู้ใช้)
- เปลี่ยนรหัสผ่านได้
- บทบาท: USER และ ADMIN

### 📝 ระบบขอใช้โดเมน
- ส่งคำขอใช้โดเมน
- ระบุข้อมูล: ชื่อโดเมน, วัตถุประสงค์, IP Address, ผู้ขอ, ผู้รับผิดชอบ, หน่วยงาน, ช่องทางติดต่อ
- เลือกประเภท: ถาวร (PERMANENT) หรือ ชั่วคราว (TEMPORARY)
- ติดตามสถานะคำขอ

### ✅ ระบบอนุมัติ (Admin)
- อนุมัติ/ปฏิเสธคำขอ
- ซ่อนการ์ดหลังการอนุมัติ/ปฏิเสธ (60 นาที)
- แสดงการ์ดที่ซ่อนไว้ (Admin เท่านั้น)
- แก้ไขเวลาซ่อนได้

### 🗑️ ระบบถังขยะ
- โดเมนหมดอายุย้ายเข้าถังขยะ
- ลบถาวรหลังอยู่ในถังขยะ 90 วัน
- แสดงเวลาที่เหลือก่อนลบถาวร

### 🔄 ระบบต่ออายุ
- ต่ออายุโดเมนชั่วคราว
- เปลี่ยนสถานะกลับเป็น ACTIVE

### 🔧 ระบบจัดการ (Admin)
- เพิ่มผู้ใช้ (สุ่มรหัสผ่าน)
- ลบผู้ใช้
- ดูรายการผู้ใช้ทั้งหมด
- อนุมัติ/ปฏิเสธคำขอ

## 🛠️ การติดตั้ง

### 1. Clone Repository
\`\`\`bash
git clone [repository-url]
cd fnon
\`\`\`

### 2. ติดตั้ง Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. ตั้งค่า Environment
สร้างไฟล์ \`.env\` (ไฟล์มีอยู่แล้ว):
\`\`\`env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### 4. ตั้งค่าฐานข้อมูล
\`\`\`bash
# สร้างฐานข้อมูล
npx prisma db push

# สร้างข้อมูลเริ่มต้น
npx tsx prisma/seed.ts
\`\`\`

### 5. รันระบบ
\`\`\`bash
npm run dev
\`\`\`

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

## 👤 บัญชีทดสอบ

### Admin
- **Username:** `admin`
- **Password:** `admin123`

### Users
- **Username:** `user01`, **Password:** `passuser01`
- **Username:** `user02`, **Password:** `passuser02`

## 📄 หน้าเว็บ

### 🏠 หน้าแรก (`/`)
- แสดงโดเมนที่ใช้งานอยู่
- แสดงโดเมนในถังขยะ
- เข้าถึงได้โดยไม่ต้องเข้าสู่ระบบ

### 🔐 เข้าสู่ระบบ (`/login`)
- ล็อกอินด้วย Username + Password
- ไม่มีระบบสมัครสมาชิก

### 📝 ขอใช้โดเมน (`/request`)
- ส่งคำขอใช้โดเมนใหม่
- ดูคำขอทั้งหมด
- Admin สามารถดูการ์ดที่ซ่อนไว้

### 🎫 คำขอของฉัน (`/my-tickets`)
- ดูคำขอของตนเอง
- ลบคำขอที่รอพิจารณา
- ต่ออายุโดเมนชั่วคราว

### 🔧 จัดการระบบ (`/admin`)
- เพิ่มผู้ใช้ใหม่
- ลบผู้ใช้
- อนุมัติ/ปฏิเสธคำขอ
- ดูรายการผู้ใช้ทั้งหมด

### 🔑 เปลี่ยนรหัสผ่าน (`/change-password`)
- เปลี่ยนรหัสผ่านของตนเอง
- ตรวจสอบรหัสผ่านปัจจุบัน

## 🗃️ โครงสร้างฐานข้อมูล

### Users
- `id`, `username`, `password`, `role`, `createdAt`

### DomainRequest
- `id`, `domain`, `purpose`, `ipAddress`, `requesterName`, `responsibleName`
- `department`, `contact`, `requestedAt`, `durationType`, `expiresAt`
- `status`, `approvalCooldownAt`, `userId`

### Domain
- `id`, `domainRequestId`, `lastUsedAt`, `deletedAt`, `trashExpiresAt`, `status`

### DeletedDomainLog
- `id`, `domainName`, `deletedAt`, `reason`

## 🔄 ระบบ Cleanup

### API Endpoint: `/api/cleanup`
- **GET:** ดูข้อมูลการทำงาน
- **POST:** รัน cleanup job

### การทำงาน:
1. ย้ายโดเมนหมดอายุไปถังขยะ
2. ลบโดเมนที่อยู่ในถังขยะเกิน 90 วัน
3. บันทึกการลบในตาราง `DeletedDomainLog`

### การใช้งาน:
\`\`\`bash
# ดูสถานะ
curl http://localhost:3000/api/cleanup

# รัน cleanup
curl -X POST http://localhost:3000/api/cleanup
\`\`\`

## 🎨 การออกแบบ UI

### Light Theme
- **พื้นหลัง:** `bg-white`, `bg-gray-50`
- **ตัวอักษร:** `text-gray-900`
- **ปุ่ม:** `bg-blue-600`, `hover:bg-blue-700`
- **การ์ด:** `rounded-xl`, `shadow-md`

### Animations
- ใช้ Framer Motion สำหรับ transitions
- Fade in/out effects
- Smooth hover states

### Icons
- ใช้ Lucide React Icons
- สถานะต่างๆ มีไอคอนเฉพาะ

## 🔐 Security

### Authentication
- ใช้ NextAuth.js
- JWT tokens
- Session management
- Route protection middleware

### Authorization
- Role-based access control
- Admin-only routes
- User-specific data access

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for tablets and smartphones

## 🚀 การ Deploy

### สำหรับ Production:
1. ตั้งค่า environment variables
2. ใช้ PostgreSQL แทน SQLite
3. ตั้งค่า NEXTAUTH_SECRET ที่ปลอดภัย
4. ตั้งค่า cron job สำหรับ cleanup

### Environment Variables:
\`\`\`env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://yourdomain.com"
\`\`\`

## 📞 การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบ logs ใน console
2. ตรวจสอบ network requests
3. ดูไฟล์ README นี้
4. ติดต่อผู้พัฒนาระบบ

## 🔄 การอัปเดต

### เพิ่มฟีเจอร์ใหม่:
1. แก้ไข Prisma schema
2. รัน `npx prisma db push`
3. อัปเดต API routes
4. เพิ่ม UI components

### การบำรุงรักษา:
- รัน cleanup job เป็นประจำ
- ตรวจสอบ logs
- อัปเดต dependencies
- สำรองข้อมูล

---

พัฒนาโดย: [ชื่อผู้พัฒนา]  
สำหรับ: มหาวิทยาลัยราชภัฏนครศรีธรรมราช  
เวอร์ชัน: 1.0.0
