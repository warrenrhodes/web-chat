"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/auth-store";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const { user, logout } = useAuthStore();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <MessageCircle className="w-16 h-16 text-white mx-auto" />
            <h1 className="text-4xl font-bold text-white">Welcome to Chatty</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Connect with friends and colleagues in real-time through our
              modern chat platform.
            </p>
          </div>
          {user ? (
            <Button
              asChild
              variant="outline"
              className="bg-primary text-primary-foreground"
            >
              <Link href="/chat">Conversations</Link>
            </Button>
          ) : (
            <div className="space-x-4">
              <Button
                asChild
                variant="outline"
                className="bg-primary text-primary-foreground"
              >
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-up">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
