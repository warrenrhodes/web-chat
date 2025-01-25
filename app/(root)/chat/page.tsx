"use client";

import { Suspense } from "react";
import LoadingFallback from "@/components/chat/Loading";
import ChatView from "@/components/chat/ChatView";
import { useAuthStore } from "@/hooks/auth-store";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function Chat() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChatContent />
    </Suspense>
  );
}

const ChatContent = () => {
  const { user, loading, logout } = useAuthStore();

  if (loading || !user) {
    return <LoadingFallback />;
  }

  if (!user?.emailVerified) {
    return (
      <div className="w-full h-screen bg=re">
        <div className="flex flex-col items-center justify-center px-4 py-12 w-full h-full gap-5">
          <p>Verify your email and reload the page</p>
          <p>Or</p>
          <Button variant="default" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return <ChatView />;
};
