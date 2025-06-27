"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import AppLogo from "./app-logo";
import {
  AchievementsIcon,
  DashboardIcon,
  RestaurantsIcon,
  UserIcon,
  Policies,
} from "@/lib/svg";
import policyIcon from ".././../public/images/mynaui_clipboard-solid.png"
import { NavProjects } from "./nav-projects";
import { redirect } from "next/dist/server/api-utils";
import {signOut} from "next-auth/react";
import { useRouter } from "next/navigation";
// This is sample data.
const data = {
  user: {
    name: "Kane",
    profile: "Admin",
    avatar: "https://github.com/shadcn.png",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
    },
    {
      title: "Users",
      url: "#",
      icon: UserIcon,
      items: [
        { title: "All Users", url: "/all-users" },
        { title: "Blocked Users", url: "/blocked-users" },
      ],
    },
    {
      title: "Restaurants",
      url: "/restaurants",
      icon: RestaurantsIcon,
    },
    {
      title: "Achievements",
      url: "/all-achievements",
      icon: AchievementsIcon,
    },
     {
      title: "Policies",
      url: "/policies",
      icon: Policies,
    },
  ],
  projects: [
    {
      title: "Logout",
      url: "/",
      icon: UserIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const router = useRouter();
  const handleLogout = async () =>{
   try {
     localStorage.removeItem("token")
      await signOut({
        redirect:false
      });
      router.push("/");
   } catch (error) {
     localStorage.removeItem("token")
      await signOut({
        redirect:false
      });
      router.push("/");
   }
  }
  const projectsWithHandlers = data.projects.map(item => {
    if (item.title === "Logout") {
      return {
        ...item,
        onClick: handleLogout,
      };
    }
    return item;
  });
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      <NavProjects items={projectsWithHandlers} />
      </SidebarFooter>
    </Sidebar>
  );
}
