import NextAuth from "next-auth"
import "next-auth/jwt"

import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/db/db"

const profile = (profile) => {
  console.log(profile);
  return { createdAt: new Date(Date.now()), codes: [], email: profile.email ? profile.email : profile.id };
}

const config = {
  adapter: MongoDBAdapter(client),
  session: {
      strategy: "database",
      maxAge: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60
  },
  providers: [Google({profile})]
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
