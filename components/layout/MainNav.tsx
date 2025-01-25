"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import { useAuthStore } from "@/hooks/auth-store";

export function MainNav({
  items,
}: {
  items: {
    user: User;
    isActive?: boolean;
  }[];
}) {
  const { setChatWithUser } = useAuthStore();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuSubItem key={item.user.name} className="mb-3">
            <SidebarMenuSubButton
              onClick={() => setChatWithUser(item.user)}
              className="cursor-pointer"
            >
              <span>{item.user.name}</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
