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
  CoupanIcon,
} from "@/lib/svg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NavProjects } from "./nav-projects";
import { signOut } from "next-auth/react";
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
      matchUrls: ["/all-users", "/blocked-users"],
    },
    {
      title: "Restaurants",
      url: "/restaurants",
      icon: RestaurantsIcon,
      matchUrls: ["/add-new-offers", "/add-new-restaurant"],
    },
    {
      title: "Achievements",
      url: "/all-achievements",
      icon: AchievementsIcon,
      matchUrls: ["/add-new-achievements"],
    },
    {
      title: "Policies",
      url: "/policies",
      icon: Policies,
    },
    {
      title: "Coupans",
      url: "/all-coupons",
      icon: CoupanIcon,
      matchUrls: ["/add-new-coupons"],
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
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const handleLogout = async () => {
    try {
      signOut({ callbackUrl: "/" });
    } catch (error) {
        signOut({ callbackUrl: "/" });

    }
  };

  const projectsWithHandlers = data.projects.map((item) => {
    if (item.title === "Logout") {
      return {
        ...item,
        onClick: () => setIsLogoutDialogOpen(true),
        className: "cursor-pointer",
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
        <AlertDialog
          open={isLogoutDialogOpen}
          onOpenChange={setIsLogoutDialogOpen}
        >
          <AlertDialogContent className="border-0 bg-[#182226] py-10 md:px-14 md:!max-w-[428px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="hide" />
              <AlertDialogDescription className="text-center text-white text-lg font-normal opacity-80 md:!max-w-[220px] m-auto">
                Are you sure you want to logout?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="!justify-center items-center mt-5">
              <AlertDialogCancel className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer !bg-[#e4bc84] rounded-lg !text-[#0a0e11] text-sm">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-white text-sm !bg-[#298400]"
                onClick={handleLogout}
              >
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
