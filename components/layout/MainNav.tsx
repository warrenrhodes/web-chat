"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function MainNav({
  items,
}: {
  items: {
    title: string;
    url: string;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuSubItem key={item.title} className="mb-3">
            <SidebarMenuSubButton asChild>
              <Link href={item.url} className="p-3">
                <span>{item.title}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
