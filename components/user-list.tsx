"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "./providers/auth-provider";
import { DatabaseDocument, getDocumentId } from "@spreeloop/database";

interface UserListProps {
  onSelectUser: (user: User) => void;
}

export default function UserList({ onSelectUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    const parseData = JSON.parse(data);
    const rightDocuments = parseData.filter(
      (document: DatabaseDocument<User>) =>
        getDocumentId(document.path) !== currentUser?.uid
    );
    setUsers(
      rightDocuments.map((document: DatabaseDocument<User>) => document.data)
    );
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] border-r">
      <div className="p-4 space-y-4">
        <h2 className="font-semibold">Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <Button
              key={user.createdAt}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectUser(user)}
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
