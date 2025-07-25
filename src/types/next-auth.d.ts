import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      role: string
      email?: string | null
    }
  }

  interface User {
    id: string
    username: string
    role: string
    email?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    username: string
  }
}
