"use client";
import { Card } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { motion } from "framer-motion";
import MessageActions from "./MessageActions";

interface ChatMessageProps {
  message: Prisma.MessageGetPayload<{}>;
  currentUserId: string;
  isHighlighted: boolean;
  onEdit: (message: Prisma.MessageGetPayload<{}>) => void;
  onDelete: (messageId: string) => void;
}

export const ChatMessage = ({
  message,
  currentUserId,
  isHighlighted,
  onEdit,
  onDelete,
}: ChatMessageProps) => {
  const isCurrentUser = message.senderId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card
        className={`p-4 max-w-[40%] transition-all duration-300 ${
          isCurrentUser
            ? "ml-auto bg-primary text-primary-foreground"
            : "bg-white"
        } ${isHighlighted ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
      >
        <div className="flex justify-between items-start relative">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{message.senderName}</span>
              {isCurrentUser && (
                <MessageActions
                  message={message}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>
            <div className="mt-1">{message.text}</div>
            {message.isEdited && (
              <div className="text-xs italic mt-1">(edited)</div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

ChatMessage.displayName = "ChatMessage";
