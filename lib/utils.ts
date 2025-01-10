import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MessageResponse {
  messages: Prisma.MessageGetPayload<{}>[];
  deletedMessageIds: string[];
}

export async function* streamMessagesByChat(
  chatId: string,
  signal: AbortSignal,
  batchSize = 100
) {
  let lastMessageId: string | undefined = undefined;
  let isFirstFetch = true;

  while (!signal.aborted) {
    try {
      const messageSnapshot = await fetch("/api/messages/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          ...(lastMessageId && {
            lastMessageId,
          }),
        }),
      });

      if (!messageSnapshot.ok) {
        throw new Error(`HTTP error! status: ${messageSnapshot.status}`);
      }

      const response = await messageSnapshot.json();

      // Always yield both messages and deletedIds, even if empty
      yield {
        type: "UPDATE",
        messages: response,
        deletedMessageIds: response.deletedMessageIds,
      };

      if (response?.length > 0) {
        lastMessageId = response[response.length - 1].id;
      }

      isFirstFetch = false;

      // Poll for new messages every few seconds
      await new Promise((resolve) => {
        const timeoutId = setTimeout(resolve, 3000);
        signal.addEventListener("abort", () => clearTimeout(timeoutId));
      });
    } catch (error) {
      if (signal.aborted) break;

      console.error("Error fetching messages:", error);
      await new Promise((resolve) => {
        const timeoutId = setTimeout(resolve, 5000);
        signal.addEventListener("abort", () => clearTimeout(timeoutId));
      });
    }
  }
}
