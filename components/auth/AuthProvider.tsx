"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/hooks/auth-store";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
