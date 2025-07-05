# 🌐 ระบบขอใช้โดเมน - มหาวิทยาลัยราชภัฏนครศรีธรรมราช

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11+-pink?style=for-the-badge&logo=framer)
![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748?style=for-the-badge&logo=prisma)

**ระบบจัดการคำขอใช้ชื่อโดเมนที่ทันสมัย พร้อม Glass Morphism Design**

[🚀 เริ่มต้นใช้งาน](#-การติดตั้ง) • [📖 เอกสาร](#-เอกสารการใช้งาน) • [🎨 Demo](#-demo) • [🤝 การมีส่วนร่วม](#-การมีส่วนร่วม)

</div>

---

## ✨ คุณสมบัติเด่น

### 🎨 **Modern Glass Design**
- **Glass Morphism Effects** - เอฟเฟกต์แก้วโปร่งใสทันสมัย
- **Orange Theme** - ธีมสีส้มที่สวยงามและอบอุ่น
- **Smooth Animations** - แอนิเมชันที่ลื่นไหลด้วย Framer Motion
- **Responsive Design** - รองรับทุกขนาดหน้าจอ

### 🚀 **เทคโนโลยีล้ำสมัย**
- **Next.js 14+** App Router - เฟรมเวิร์กที่เร็วและมีประสิทธิภาพ
- **TypeScript** - Type Safety เพื่อความปลอดภัย
- **Tailwind CSS 4.0** - Utility-first CSS Framework
- **Prisma ORM** - Object-Relational Mapping ที่ทันสมัย
- **NextAuth.js** - การยืนยันตัวตนที่ปลอดภัย

### 🔐 **ระบบความปลอดภัย**
- การยืนยันตัวตนด้วย Username/Password
- การจัดการสิทธิ์ Admin และ User
- ป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต
- การเข้ารหัสข้อมูลที่ปลอดภัย

### 📋 **การจัดการโดเมนครบวงจร**
- ส่งคำขอใช้โดเมนพร้อมข้อมูลครบถ้วน
- ระบบอนุมัติ/ปฏิเสธของ Admin
- การจัดการโดเมนแบบถาวรและชั่วคราว
- ระบบต่ออายุและถังขยะอัตโนมัติ

---

## 🛠️ การติดตั้ง

### 📋 ข้อกำหนดของระบบ

- **Node.js** 18.0+ 
- **npm** หรือ **yarn** หรือ **pnpm**
- **Git** สำหรับ Version Control

### ⚡ Quick Start

```bash
# 1. Clone โปรเจค
git clone https://github.com/your-username/domain-request-system.git
cd domain-request-system

# 2. ติดตั้ง Dependencies
npm install
# หรือ
yarn install
# หรือ
pnpm install

# 3. ตั้งค่าฐานข้อมูล
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. สร้างไฟล์ Environment Variables
cp .env.example .env

# 5. รันโปรเจค
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
```

### 🔧 การตั้งค่า Environment Variables

สร้างไฟล์ `.env` และเพิ่มค่าดังนี้:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: สำหรับ Production
# NEXTAUTH_URL="https://your-domain.com"
```

---

## 🎯 การใช้งาน

### 👤 **บัญชีทดสอบ**

| บทบาท | Username | Password | สิทธิ์ |
|--------|----------|----------|--------|
| 👑 Admin | `admin` | `admin123` | จัดการระบบทั้งหมด |
| 👤 User | `user01` | `passuser01` | ส่งคำขอโดเมน |
| 👤 User | `user02` | `passuser02` | ส่งคำขอโดเมน |

### 🌐 **หน้าเว็บหลัก**

| เส้นทาง | รายละเอียด | สิทธิ์ |
|---------|------------|--------|
| `/` | หน้าแรก - แสดงโดเมนทั้งหมด | ทุกคน |
| `/login` | เข้าสู่ระบบ | ทุกคน |
| `/request` | ส่งคำขอใช้โดเมน | ผู้ใช้ที่ล็อกอิน |
| `/my-tickets` | คำขอของฉัน | ผู้ใช้ที่ล็อกอิน |
| `/admin` | จัดการระบบ | Admin เท่านั้น |
| `/change-password` | เปลี่ยนรหัสผ่าน | ผู้ใช้ที่ล็อกอิน |
| `/demo` | สาธิต Components | ทุกคน |

---

## 🏗️ โครงสร้างโปรเจค

```
fnon/
├── 📁 prisma/              # Database Schema & Seed
│   ├── schema.prisma       # โครงสร้างฐานข้อมูล
│   └── seed.ts            # ข้อมูลตัวอย่าง
├── 📁 src/
│   ├── 📁 app/            # Next.js App Router
│   │   ├── 📁 admin/      # หน้าแอดมิน
│   │   ├── 📁 api/        # API Routes
│   │   ├── 📁 demo/       # หน้าสาธิต Components
│   │   ├── 📁 login/      # หน้าล็อกอิน
│   │   ├── 📁 my-tickets/ # หน้าคำขอของฉัน
│   │   ├── 📁 request/    # หน้าส่งคำขอ
│   │   ├── layout.tsx     # Layout หลัก
│   │   ├── page.tsx       # หน้าแรก
│   │   └── globals.css    # CSS ทั่วโลก
│   ├── 📁 components/     # Components ที่ใช้ซ้ำได้
│   │   ├── AnimatedButton.tsx    # ปุ่มแอนิเมชัน
│   │   ├── AnimatedInput.tsx     # Input แอนิเมชัน
│   │   ├── GlassCard.tsx         # การ์ด Glass Effect
│   │   ├── LoadingSpinner.tsx    # Loading Components
│   │   ├── PageTransition.tsx    # Page Transitions
│   │   ├── AuthProvider.tsx      # Provider สำหรับ Auth
│   │   └── LogoutButton.tsx      # ปุ่มออกจากระบบ
│   ├── 📁 lib/            # Utilities & Helpers
│   └── 📁 types/          # TypeScript Types
├── 📄 package.json        # Dependencies
├── 📄 tailwind.config.ts  # Tailwind Configuration
├── 📄 DESIGN_UPDATE.md    # เอกสารการอัปเดตดีไซน์
└── 📄 README.md          # เอกสารนี้
```

---

## 🎨 Demo

เข้าชมหน้าสาธิต Components ต่างๆ ได้ที่:

```
http://localhost:3000/demo
```

### 🌟 **สิ่งที่จะเห็นใน Demo:**
- **Glass Cards** ในรูปแบบต่างๆ
- **Animated Buttons** หลากหลายสไตล์
- **Animated Inputs** พร้อมไอคอนและเอฟเฟกต์
- **Loading Spinners** ขนาดต่างๆ
- **Animation Examples** แบบต่างๆ

---

## 🎨 Design System

### 🎯 **สีหลัก (Orange Theme)**

```css
/* สีหลัก */
--color-primary: #ea580c;      /* Orange 600 */
--color-primary-hover: #c2410c; /* Orange 700 */
--color-accent: #f97316;        /* Orange 500 */

/* สีรอง */
--color-success: #16a34a;       /* Green 600 */
--color-danger: #dc2626;        /* Red 600 */
--color-warning: #f59e0b;       /* Yellow 500 */
```

### 🪟 **Glass Effects**

```css
/* Glass Morphism พื้นฐาน */
.glass-morphism {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Glass Morphism สีส้ม */
.glass-morphism-orange {
  background: linear-gradient(135deg, 
    rgba(254, 215, 170, 0.4), 
    rgba(253, 186, 116, 0.4)
  );
  backdrop-filter: blur(25px);
  border: 1px solid rgba(253, 186, 116, 0.3);
}
```

### 🔤 **Typography**

- **หลัก**: Sarabun (สำหรับภาษาไทย)
- **รอง**: Inter (สำหรับภาษาอังกฤษ)
- **Fallback**: system-ui, sans-serif

---

## 🔧 API Routes

### 🔐 **Authentication**
- `POST /api/auth/[...nextauth]` - NextAuth.js Endpoints
- `POST /api/change-password` - เปลี่ยนรหัสผ่าน

### 📋 **Domain Requests**
- `GET /api/requests` - ดึงคำขอทั้งหมด
- `POST /api/requests` - สร้างคำขอใหม่
- `PUT /api/requests/[id]` - อัปเดตคำขอ (อนุมัติ/ปฏิเสธ)
- `DELETE /api/requests/[id]` - ลบคำขอ
- `GET /api/my-requests` - ดึงคำขอของผู้ใช้

### 🌐 **Domains**
- `GET /api/domains` - ดึงโดเมนทั้งหมด
- `POST /api/domains/[id]/renew` - ต่ออายุโดเมน

### 👥 **Admin**
- `GET /api/admin/users` - ดึงผู้ใช้ทั้งหมด
- `POST /api/admin/users` - สร้างผู้ใช้ใหม่
- `DELETE /api/admin/users/[id]` - ลบผู้ใช้

---

## 🧪 การทดสอบ

### 🚀 **การรันโปรเจค**

```bash
# Development Mode
npm run dev

# Production Build
npm run build
npm run start

# Type Checking
npm run type-check

# Database Operations
npx prisma studio          # เปิด Database Browser
npx prisma db push         # ซิงค์ Schema กับ Database
npx prisma db seed         # เพิ่มข้อมูลตัวอย่าง
npx prisma generate        # สร้าง Prisma Client
```

### 📱 **Responsive Testing**

ทดสอบในขนาดหน้าจอต่างๆ:
- 📱 **Mobile**: 375px - 768px
- 📺 **Tablet**: 768px - 1024px
- 🖥️ **Desktop**: 1024px+

### 🌐 **Browser Support**

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

---

## 📚 เอกสารการใช้งาน

### 🎨 **Components Usage**

#### 🃏 GlassCard
```tsx
import GlassCard from '@/components/GlassCard'

<GlassCard variant="orange" hover className="p-6">
  <h3>ชื่อการ์ด</h3>
  <p>เนื้อหา</p>
</GlassCard>
```

#### 🔘 AnimatedButton
```tsx
import AnimatedButton from '@/components/AnimatedButton'

<AnimatedButton 
  variant="primary" 
  loading={isLoading}
  onClick={handleClick}
>
  <Icon className="w-4 h-4 mr-2" />
  คลิกที่นี่
</AnimatedButton>
```

#### 📝 AnimatedInput
```tsx
import AnimatedInput from '@/components/AnimatedInput'

<AnimatedInput
  label="ป้ายกำกับ"
  placeholder="กรอกข้อมูล"
  icon={<Icon className="w-5 h-5" />}
  error={errorMessage}
  value={value}
  onChange={setValue}
/>
```

### 🎭 **Animations**

```tsx
import { 
  PageTransition, 
  FadeIn, 
  SlideIn, 
  StaggerContainer,
  StaggerItem 
} from '@/components/PageTransition'

<PageTransition>
  <FadeIn delay={0.2}>
    <h1>หัวข้อ</h1>
  </FadeIn>
  
  <StaggerContainer>
    <StaggerItem>
      <div>รายการ 1</div>
    </StaggerItem>
    <StaggerItem>
      <div>รายการ 2</div>
    </StaggerItem>
  </StaggerContainer>
</PageTransition>
```

---

## 🤝 การมีส่วนร่วม

เรายินดีรับการมีส่วนร่วมจากทุกคน! 

### 🐛 **รายงานปัญหา**
หากพบปัญหาหรือ Bug กรุณาสร้าง Issue ใน GitHub

### 💡 **เสนอคุณสมบัติใหม่**
มีไอเดียคุณสมบัติใหม่? สร้าง Feature Request ได้เลย

### 🔧 **ส่ง Pull Request**
1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add amazing feature'`)
4. Push ไปยัง Branch (`git push origin feature/amazing-feature`)
5. สร้าง Pull Request

---

## 📄 License

โปรเจคนี้ใช้ [MIT License](LICENSE) - ดูรายละเอียดในไฟล์ LICENSE

---

## 👨‍💻 ผู้พัฒนา

**มหาวิทยาลัยราชภัฏนครศรีธรรมราช**
- 🌐 Website: [https://www.nstru.ac.th](https://www.nstru.ac.th)
- 📧 Email: it@nstru.ac.th

---

## 🙏 ขอบคุณ

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Lucide Icons](https://lucide.dev/) - Icon Library

---

<div align="center">

**⭐ ถ้าโปรเจคนี้มีประโยชน์ กรุณาให้ Star ⭐**

Made with ❤️ by NSTRU IT Department

</div>
