import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';


const publicPaths = [
  '/',
  '/forgot-password',
  '/otp',
  '/reset-password',
  '/api/auth/.*', 
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();

  if (token?.accessToken) {

    response.cookies.set("backend_token", token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    const isPublicPath = publicPaths.some(publicPath => {
      if (publicPath.endsWith('.*')) {
      
        const basePath = publicPath.slice(0, -2);
        return path.startsWith(basePath);
      }
      return path === publicPath;
    });
  
    if (isPublicPath && !path.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    return response;
  }
  
  const isPublicPath = publicPaths.some(publicPath => {
    if (publicPath.endsWith('.*')) {
     
      const basePath = publicPath.slice(0, -2);
      return path.startsWith(basePath);
    }
    return path === publicPath;
  });
  
  
  if (!isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
