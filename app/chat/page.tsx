"use client";

import React, { Suspense } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "@/components/layout/Index";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import { IChat } from "@/types";
import { streamMessagesByChat } from "@/lib/utils";
import { motion } from "framer-motion";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageInput from "@/components/chat/MessageInput";
import LoadingFallback from "@/components/chat/Loading";
import { ChatMessage } from "@/components/chat/ChatMessage";

export const dynamic = "force-dynamic";

export default function Chat() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChatContent />
    </Suspense>
  );
}

const ChatContent = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchParams = useSearchParams();
  const userIdSelected = searchParams.get("user");
  const [selectedUser, setSelectedUser] =
    useState<Prisma.UserGetPayload<{}> | null>(null);
  const [messages, setMessages] = useState<Prisma.MessageGetPayload<{}>[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  const { user, loading } = useAuth();
  const router = useRouter();
  const newMessageRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !userIdSelected) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userIdSelected}`);
        const user = await response.json();
        setSelectedUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [user, userIdSelected]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const findOrCreateChat = async () => {
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participants: [user.uid, selectedUser.authId],
          }),
        });
        const data: IChat = await response.json();
        const sortedMessages = [...data.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
        setCurrentChatId(data.id);
      } catch (error) {
        console.error("Failed to create/find chat:", error);
      }
    };

    findOrCreateChat();
  }, [user, selectedUser]);

  useEffect(() => {
    if (userIdSelected) {
      if (newMessageRef.current) {
        newMessageRef.current.value = "";
      }
      setMessages([]);
      setEditingMessageId(null);
      setCurrentChatId(null);
      setSelectedUser(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [userIdSelected]);

  useEffect(() => {
    if (!user || !currentChatId) return;

    if (
      previousChatIdRef.current &&
      previousChatIdRef.current !== currentChatId
    ) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setMessages([]);
    }

    previousChatIdRef.current = currentChatId;
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;
    const fetchMessages = async () => {
      try {
        for await (const update of streamMessagesByChat(
          currentChatId,
          currentController.signal
        )) {
          if (currentController.signal.aborted) break;
          if (update.messages?.length > 0) {
            if (JSON.stringify(update.messages) !== JSON.stringify(messages)) {
              setMessages(update.messages);
            }
          } else {
            if (messages.length > 0) {
              setMessages([]);
            }
          }
        }
      } catch (error) {
        console.error("Error in message stream:", error);
      }
    };

    fetchMessages();
    if (!highlightedMessageId) {
      scrollToBottom();
    }

    return () => {
      currentController.abort();
      abortControllerRef.current = null;
    };
  }, [currentChatId, user]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight + 500,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const scrollToMessage = useCallback((messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement && scrollAreaRef.current) {
      setHighlightedMessageId(messageId);

      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        const messageTop = messageElement.offsetTop;
        const viewportHeight = viewport.clientHeight;
        const scrollTo = messageTop - viewportHeight / 3;

        viewport.scrollTo({
          top: scrollTo,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 4000);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    const message = newMessageRef.current?.value || "";

    if (!message.trim() || !user) return;

    try {
      if (editingMessageId) {
        await fetch("/api/messages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId: editingMessageId,
            text: message,
            isEdited: true,
          }),
        });

        if (newMessageRef.current) {
          newMessageRef.current.value = "";
        }

        setEditingMessageId(null);
      } else {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: currentChatId,
            senderId: user.uid,
            senderName: user.displayName,
            text: message,
          }),
        });

        if (newMessageRef.current) {
          newMessageRef.current.value = "";
        }

        setTimeout(() => scrollToBottom(), 0);
      }
    } catch (error) {
      console.error("Failed to send/edit message:", error);
    }
  }, [currentChatId, editingMessageId, user]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await fetch(`/api/messages?messageId=${messageId}`, {
        method: "DELETE",
      });

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }, []);

  const startEdit = useCallback((message: Prisma.MessageGetPayload<{}>) => {
    if (newMessageRef.current) {
      newMessageRef.current.value = message.text;
    }
    setEditingMessageId(message.id);
  }, []);

  const cancelEdit = useCallback(() => {
    if (newMessageRef.current) {
      newMessageRef.current.value = "";
    }
    setEditingMessageId(null);
  }, []);

  if (loading || !user) {
    return <LoadingFallback />;
  }

  return (
    <NewSideBar>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <ChatHeader
          selectedUser={selectedUser}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          chatId={currentChatId}
          onMessageSelect={scrollToMessage}
        />

        <div className="flex-grow overflow-hidden flex flex-col">
          {!selectedUser ? (
            <div className="p-4 flex items-center justify-center h-full w-full">
              Select a conversation
            </div>
          ) : (
            <ScrollArea
              className="flex-grow p-4 overflow-y-auto"
              ref={scrollAreaRef}
            >
              <motion.div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    ref={(el) => (messageRefs.current[message.id] = el)}
                  >
                    <ChatMessage
                      message={message}
                      currentUserId={user.uid}
                      isHighlighted={highlightedMessageId === message.id}
                      onEdit={startEdit}
                      onDelete={deleteMessage}
                    />
                  </div>
                ))}
              </motion.div>
            </ScrollArea>
          )}
        </div>

        {selectedUser && (
          <MessageInput
            onSubmit={onSubmit}
            editingMessageId={editingMessageId}
            newMessageRef={newMessageRef}
            onCancelEdit={cancelEdit}
          />
        )}
      </div>
    </NewSideBar>
  );
};

const NewSideBar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-10 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
