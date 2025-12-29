"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SideBarOptions } from "../../services/Constants";

export default function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center mt-5">
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={100}
          className="w-[150px]"
        />

        <Link href="/dashboard" className="w-full">
          <Button className="w-full mt-5 gap-2">
            <Plus /> Create New Interview
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option) => (
              <SidebarMenuItem key={option.path} className="p-1">

                <Link href={option.path} className="block">
                  <SidebarMenuButton
                    className={`p-5 flex gap-3 items-center w-full ${
                      path === option.path ? "bg-blue-50 text-primary" : ""
                    }`}
                  >
                    <option.icon
                      className={path === option.path ? "text-primary" : ""}
                    />
                    <span className="text-[16px]">
                      {option.name}
                    </span>
                  </SidebarMenuButton>
                </Link>

              </SidebarMenuItem>
            ))}
          </SidebarMenu>

        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
