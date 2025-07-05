import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user) {
          return null
        }

        // ใช้ plain text password ตาม requirements
        if (user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          email: null // ไม่ใช้ email
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // ถ้า url เป็น relative path ให้ใช้ baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // ถ้า url เป็น absolute path และเป็น same origin ให้ใช้ได้
      if (url.startsWith(baseUrl)) {
        return url
      }
      // อื่นๆ ให้ redirect ไปที่ baseUrl
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}
