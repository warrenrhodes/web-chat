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
import { auth } from "@/lib/firebase";
import { Button } from "../ui/button";
import { MainNav } from "./MainNav";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../providers/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: currentUserr, logout } = useAuth();
  const [users, setUsers] = useState<Prisma.UserGetPayload<{}>[]>([]);
  const { signOut, currentUser } = auth;
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!data) {
      return;
    }

    setUsers(data.filter((user: any) => user.authId !== currentUserr?.uid));
  }, [currentUserr?.uid]);

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
            title: user.name,
            isActive: false,
            url: `/chat?user=${user.id}`,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        {currentUserr && (
          <UserInfo
            user={{
              name: currentUserr?.displayName || currentUserr?.email || "",
              email: currentUserr?.email || "",
              avatar: currentUserr?.photoURL || "",
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
                    console.log("signing out");
                    await logout();
                    // router.replace("/");
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
