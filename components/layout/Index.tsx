"use client";

import { LogOut, MessageCircleMore } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  Sidebar,
} from "../ui/sidebar";
import { UserInfo } from "./UserInfo";
import { Button } from "../ui/button";
import { MainNav } from "./MainNav";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { useAuthStore } from "@/hooks/auth-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: currentUser, logout } = useAuthStore();
  const [users, setUsers] = useState<Prisma.UserGetPayload<{}>[]>([]);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!data) {
      return;
    }

    setUsers(data.filter((user: any) => user.authId !== currentUser?.uid));
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/chat">
                <div className="flex  size-8 items-center justify-center rounded-lg">
                  <MessageCircleMore className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{"Web Chat"}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <MainNav
          items={users.map((user) => ({
            user: user,
            isActive: false,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        {currentUser && (
          <UserInfo
            user={{
              name: currentUser?.displayName || currentUser?.email || "",
              email: currentUser?.email || "",
              avatar: currentUser?.photoURL || "",
            }}
          />
        )}
        {currentUser && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  type="button"
                  onClick={async () => {
                    await logout();
                  }}
                  variant="ghost"
                  className="flex items-start gap-3 w-full justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
