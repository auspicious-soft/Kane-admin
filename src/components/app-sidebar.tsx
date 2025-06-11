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
} from "@/lib/svg";
import { NavProjects } from "./nav-projects";

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
      url: "/achievements",
      icon: AchievementsIcon,
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavProjects items={data.projects} />
      </SidebarFooter>
    </Sidebar>
  );
}
