# 🌐 ระบบขอใช้โดเมน - มหาวิทยาลัยราชภัฏนครศรีธรรมราช

ระบบจัดการคำขอใช้ชื่อโดเมนที่สมบูรณ์แบบ พร้อมฟีเจอร์ครบครัน

## 🚀 Quick Start

### การติดตั้งอัตโนมัติ (แนะนำ)
```bash
cd C:\Users\kkhem\Downloads\fnon
npm run setup
```

### การติดตั้งแบบทีละขั้นตอน
```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตั้งค่า database
npm run db:push

# 3. ใส่ข้อมูลตัวอย่าง
npm run db:seed

# 4. เริ่มต้น development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ใน browser

## 👥 บัญชีทดสอบ

- **Admin:** `admin` / `admin123`
- **User1:** `user01` / `passuser01`  
- **User2:** `user02` / `passuser02`

## ✨ ฟีเจอร์หลัก

### 🎯 ระบบคำขอใช้โดเมน
- ✅ ส่งคำขอใหม่จากหน้าแรก
- ✅ ระบบอนุมัติ/ไม่อนุมัติ
- ✅ ติดตามสถานะคำขอ
- ✅ จัดการโดเมนถาวร/ชั่วคราว

### 🔄 ระบบต่ออายุ (ใหม่!)
- ✅ ขอต่ออายุแบบเลือกวันที่
- ✅ ระบุเหตุผลในการต่ออายุ
- ✅ ระบบตั๋วต่ออายุแยกต่างหาก
- ✅ หน้าจัดการคำขอต่ออายุสำหรับ admin

### 📊 ระบบจัดการ
- ✅ หมวดโดเมนหมดอายุ
- ✅ ระบบถังขยะ (90 วัน)
- ✅ กู้คืนโดเมน
- ✅ ประวัติการลบ

### 🔐 ระบบสิทธิ์
- ✅ User: ดูเฉพาะคำขอของตนเอง
- ✅ Admin: ดูและจัดการทั้งหมด
- ✅ ระบบ Authentication ด้วย NextAuth
- ✅ เปลี่ยนรหัสผ่าน

## 🗂️ โครงสร้างหน้าเว็บ

| หน้า | URL | สิทธิ์ | คำอธิบาย |
|------|-----|--------|----------|
| หน้าแรก | `/` | ทุกคน | ดูโดเมน + ส่งคำขอใหม่ + ขอต่ออายุ |
| คำขอของฉัน | `/my-tickets` | ล็อกอิน | ดูคำขอส่วนตัว (admin เห็นทั้งหมด) |
| จัดการคำขอต่ออายุ | `/renewal-management` | Admin | อนุมัติ/ไม่อนุมัติคำขอต่ออายุ |
| จัดการระบบ | `/admin` | Admin | จัดการผู้ใช้ + คำขอที่ซ่อน |
| เข้าสู่ระบบ | `/login` | ทุกคน | Authentication |
| เปลี่ยนรหัสผ่าน | `/change-password` | ล็อกอิน | เปลี่ยนรหัสผ่าน |

## 📋 ข้อมูลตัวอย่าง

ระบบมีข้อมูลตัวอย่างพร้อมใช้งาน:
- **โดเมนใช้งาน:** library.nstru.ac.th
- **โดเมนหมดอายุ:** expired.nstru.ac.th  
- **โดเมนในถังขยะ:** old.nstru.ac.th
- **คำขอรอพิจารณา:** event.nstru.ac.th
- **คำขอต่ออายุ:** หลายสถานะ

## 🔧 คำสั่งที่มีประโยชน์

```bash
# Development
npm run dev          # เริ่มต้น development server
npm run build        # Build สำหรับ production
npm run start        # เริ่มต้น production server

# Database
npm run db:studio    # เปิด Prisma Studio
npm run db:reset     # รีเซ็ต database + seed ใหม่
npm run cleanup      # ย้ายโดเมนหมดอายุไปถังขยะ

# Testing & Setup
npm run setup        # ติดตั้งระบบอัตโนมัติ
npm run test:system  # ทดสอบระบบทั้งหมด
npm run lint         # ตรวจสอบ code quality
```

## 🎯 การใช้งาน

### สำหรับ User ธรรมดา
1. **ส่งคำขอใหม่:** หน้าแรก → "ส่งคำขอใช้โดเมน"
2. **ขอต่ออายุ:** หน้าแรก → "ขอต่ออายุ" → เลือกโดเมน
3. **ติดตามคำขอ:** `/my-tickets` → ดูสถานะคำขอ
4. **ลบคำขอ:** `/my-tickets` → ลบคำขอที่รอพิจารณา

### สำหรับ Admin
1. **อนุมัติคำขอ:** `/my-tickets` → อนุมัติ/ไม่อนุมัติ
2. **จัดการคำขอต่ออายุ:** `/renewal-management`
3. **จัดการโดเมน:** หน้าแรก → ลบ/กู้คืน
4. **จัดการผู้ใช้:** `/admin` → เพิ่ม/ลบผู้ใช้

## 🛠️ เทคโนโลยี

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** SQLite + Prisma ORM
- **Authentication:** NextAuth.js
- **Icons:** Lucide React

## 📁 โครงสร้างโปรเจค

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── my-tickets/        # User tickets
│   ├── renewal-management/ # Renewal management
│   └── ...
├── components/            # React components
├── lib/                   # Utilities
└── types/                 # TypeScript types

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Sample data

scripts/
├── setup.js             # Auto setup script
├── test-system.js       # System testing
└── cleanup.js          # Cleanup utilities
```

## 📚 เอกสารเพิ่มเติม

- **[SETUP.md](./SETUP.md)** - คู่มือการติดตั้งและใช้งานแบบละเอียด
- **[CHANGELOG.md](./CHANGELOG.md)** - สรุปการเปลี่ยนแปลงล่าสุด
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - ภาพรวมระบบทั้งหมด

## 🎉 สรุป

ระบบขอใช้โดเมนเวอร์ชั่นใหม่นี้:
- **ใช้งานง่าย** - ฟอร์มส่งคำขอในหน้าแรก
- **ครบครัน** - ระบบต่ออายุ + จัดการสิทธิ์
- **ปลอดภัย** - ระบบสิทธิ์ + Authentication
- **ทันสมัย** - UI/UX สวยงาม + responsive

**พร้อมใช้งานจริง! 🚀**

---

## 🔍 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

```bash
# ไม่สามารถเชื่อมต่อ database
npm run db:reset

# Port 3000 ถูกใช้งานแล้ว
npm run dev -- -p 3001

# Module not found
rm -rf node_modules package-lock.json
npm install

# ข้อมูลไม่ถูกต้อง
npm run db:seed
```

### การรายงานปัญหา

หากพบปัญหาการใช้งาน:
1. ตรวจสอบ console log
2. ลอง reset database
3. ตรวจสอบ server logs
4. ดูเอกสาร SETUP.md

---

## 📄 ลิขสิทธิ์

**มหาวิทยาลัยราชภัฏนครศรีธรรมราช**  
พัฒนาโดย: ฝ่ายเทคโนโลยีสารสนเทศ