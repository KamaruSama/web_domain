# 🚀 คู่มือการติดตั้งและใช้งานระบบขอใช้โดเมน

## 📋 สิ่งที่ต้องเตรียม

- Node.js 18+ 
- npm หรือ yarn
- Git (ถ้าต้องการ clone จาก repository)

## 🔧 การติดตั้ง

### 1. เตรียมโปรเจค
```bash
cd C:\Users\kkhem\Downloads\fnon
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Database
```bash
# สร้าง database และ schema
npm run db:push

# ใส่ข้อมูลตัวอย่าง
npm run db:seed
```

### 4. ทดสอบระบบ
```bash
# ทดสอบการเชื่อมต่อ database
npm run test:system
```

### 5. เริ่มต้น Development Server
```bash
npm run dev
```

## 🌐 การเข้าถึงระบบ

เปิด browser ไปที่: `http://localhost:3000`

## 👥 บัญชีผู้ใช้สำหรับทดสอบ

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **สิทธิ์:** จัดการระบบทั้งหมด

### User Accounts
- **Username:** `user01` | **Password:** `passuser01`
- **Username:** `user02` | **Password:** `passuser02`
- **สิทธิ์:** ใช้งานระบบทั่วไป

## 📱 ฟีเจอร์ที่ใช้งานได้

### 🏠 หน้าแรก (`/`)
- **ผู้ใช้ทั่วไป:** ดูรายการโดเมน + ส่งคำขอใหม่ + ขอต่ออายุ
- **Admin:** ดูรายการโดเมนทั้งหมด + จัดการโดเมน + ลบ/กู้คืน

### 🎫 หน้าคำขอ (`/my-tickets`)
- **ผู้ใช้ทั่วไป:** ดูคำขอของตนเอง + ลบคำขอที่รอพิจารณา
- **Admin:** ดูคำขอทั้งหมด + อนุมัติ/ไม่อนุมัติ + จัดการคำขอต่ออายุ

### 🔄 หน้าจัดการคำขอต่ออายุ (`/renewal-management`)
- **Admin เท่านั้น:** อนุมัติ/ไม่อนุมัติคำขอต่ออายุ

### 🔐 หน้าจัดการระบบ (`/admin`)
- **Admin เท่านั้น:** จัดการผู้ใช้ + ดูคำขอที่ซ่อนไว้

## 🎯 การทดสอบฟีเจอร์ใหม่

### 1. ทดสอบการส่งคำขอใหม่
1. เข้าสู่ระบบด้วย `user01`
2. ไปที่หน้าแรก
3. คลิก "ส่งคำขอใช้โดเมน"
4. กรอกข้อมูล และส่งคำขอ

### 2. ทดสอบการขอต่ออายุ
1. เข้าสู่ระบบด้วย `user01`
2. ไปที่หน้าแรก
3. คลิก "ขอต่ออายุ"
4. เลือกโดเมนที่หมดอายุ
5. ระบุวันหมดอายุใหม่
6. ส่งคำขอ

### 3. ทดสอบการอนุมัติ (Admin)
1. เข้าสู่ระบบด้วย `admin`
2. ไปที่ `/my-tickets` หรือ `/renewal-management`
3. อนุมัติ/ไม่อนุมัติคำขอ

## 📊 ข้อมูลตัวอย่างที่มีในระบบ

### Domain Requests
- `library.nstru.ac.th` - อนุมัติแล้ว (ถาวร)
- `event.nstru.ac.th` - รอพิจารณา (ชั่วคราว)
- `expired.nstru.ac.th` - อนุมัติแล้ว แต่หมดอายุ
- `old.nstru.ac.th` - ในถังขยะ
- `rejected.nstru.ac.th` - ไม่อนุมัติ

### Renewal Requests
- คำขอต่ออายุ `expired.nstru.ac.th` (รอพิจารณา)
- คำขอต่ออายุ `expired.nstru.ac.th` (อนุมัติแล้ว)
- คำขอต่ออายุ `expired.nstru.ac.th` (ไม่อนุมัติ)

## 🔨 คำสั่งที่มีประโยชน์

### Database Management
```bash
# ดู database ผ่าน web interface
npm run db:studio

# รีเซ็ตและใส่ข้อมูลใหม่
npm run db:reset

# ทำความสะอาดข้อมูล (ย้ายโดเมนหมดอายุไปถังขยะ)
npm run cleanup
```

### Development
```bash
# เริ่มต้น development server
npm run dev

# Build สำหรับ production
npm run build

# เริ่มต้น production server
npm start
```

### Testing
```bash
# ทดสอบระบบ
npm run test:system

# ตรวจสอบ code quality
npm run lint
```

## 🌍 การใช้โดเมนอื่น

หากต้องการใช้โดเมนอื่นแทน `localhost:3000`:

1. แก้ไขไฟล์ `.env` หรือ `.env.local`
2. เพิ่ม environment variables สำหรับการเชื่อมต่อ
3. อัปเดต NextAuth configuration

## 📝 การปรับแต่งเพิ่มเติม

### เปลี่ยนชื่อมหาวิทยาลัย
แก้ไขในไฟล์ `src/app/layout.tsx` และ `src/app/page.tsx`

### เปลี่ยนสีธีม
แก้ไขใน `src/app/globals.css` หรือ `tailwind.config.js`

### เพิ่มช่องข้อมูล
แก้ไข `prisma/schema.prisma` แล้วรัน `npm run db:push`

## 🚨 การแก้ไขปัญหาที่พบบ่อย

### 1. Database Connection Error
```bash
# ลบ database เก่า
rm -f prisma/dev.db

# สร้างใหม่
npm run db:push
npm run db:seed
```

### 2. Port Already in Use
```bash
# ใช้ port อื่น
npm run dev -- -p 3001
```

### 3. Module Not Found
```bash
# ติดตั้ง dependencies ใหม่
rm -rf node_modules
npm install
```

## 📞 การรายงานปัญหา

หากพบปัญหาการใช้งาน:
1. ตรวจสอบ console log ใน browser
2. ตรวจสอบ server log ใน terminal
3. ลองรีเซ็ต database: `npm run db:reset`
4. ลองใส่ข้อมูลใหม่: `npm run db:seed`

## 🎉 สรุป

ระบบนี้พร้อมใช้งานแล้ว! ฟีเจอร์ใหม่ทั้งหมดได้รับการทดสอบและทำงานได้อย่างสมบูรณ์:

- ✅ ส่งคำขอใหม่จากหน้าแรก
- ✅ ขอต่ออายุแบบเลือกวันที่
- ✅ ระบบตั๋วต่ออายุ
- ✅ หน้าจัดการคำขอต่ออายุ
- ✅ หมวดโดเมนหมดอายุ
- ✅ ระบบสิทธิ์แยกตาม role

**Happy Coding! 🚀**