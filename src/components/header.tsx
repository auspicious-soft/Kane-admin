'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function AppHeader() {
  const pathname = usePathname();

  // Extract segments
  const pathSegments = pathname.split('/').filter(Boolean);

  // Define custom header logic
  let pageName = 'Dashboard';

  if (pathname === '/') {
    pageName = 'Dashboard';
  } else if (pathname.startsWith('/dashboard/') && pathSegments.length === 2) {
    pageName = 'User Detail';
  } else if (pathname.startsWith('/all-users/') && pathSegments.length === 2) {
    pageName = 'User Detail';
  } else if (pathname.startsWith('/blocked-users/') && pathSegments.length === 2) {
    pageName = 'User Detail';
  } else if (pathname.startsWith('/restaurants/') && pathSegments.length === 2) {
    pageName = 'Restaurants Detail';
  } else {
    pageName = pathSegments.pop()?.replace(/-/g, ' ') ?? '';
  }

  return (
    <header className="flex shrink-0 gap-2 transition-[width,height] ease-linear border-b-1 border-[#2F2F2F] py-3 px-4 md:py-4.5 md:px-7">
      <div className="flex items-center gap-3 md:gap-5">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className=" !h-5 md:!h-6" />
        <h1 className="justify-start text-xl md:text-2xl font-medium leading capitalize">
          {pageName}
        </h1>
      </div>
    </header>
  );
}
