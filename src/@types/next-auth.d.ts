import NextAuth from 'next-auth/next'
import { StringMappingType } from 'typescript'

declare module 'next-auth' {
   interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }

  interface Session {
    user: User
  }
}
