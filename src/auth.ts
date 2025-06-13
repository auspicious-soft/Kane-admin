// src/auth.ts
import NextAuth from 'next-auth';
import { authOptions } from './lib/authOptions'; // adjust as needed

export const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;