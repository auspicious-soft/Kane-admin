"use client"

import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ReactNode } from "react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: string | (() => ReactNode);
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || (item.items && item.items.some(sub => pathname === sub.url))

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible custom-madeTommy"
            >
              <SidebarMenuItem className={isActive ? "" : ""}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className={`px-[32px] py-[15px] h-auto cursor-pointer ${isActive ? "bg-[#232d35] text-[#e4bc84]" : "font-normal"}`}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-270 ${isActive ? "rotate-[-0deg]" : "rotate-90"}`} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent> 
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title} className={isSubActive ? "" : ""}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url} className= {`p-2 h-auto hover:bg-transparent hover:!text-[#e4bc84] ${isSubActive ? "!text-[#e4bc84] " : " !text-white font-normal"}`}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title} className={isActive ? "" : " "}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url} className={`custom-madeTommy px-[32px] py-[15px] h-auto flex items-center gap-2  ${isActive ? "bg-[#232d35] text-[#e4bc84]" : "font-normal"}`}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
