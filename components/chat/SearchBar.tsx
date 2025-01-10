"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SearchBarProps {
  chatId: string;
  onCloseAction: () => void;
  onMessageSelectAction: (messageId: string) => void;
}

export default function SearchBar({
  chatId,
  onCloseAction,
  onMessageSelectAction,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Prisma.MessageGetPayload<{}>[]>([]);

  const searchMessages = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/messages/search?chatId=${chatId}&q=${encodeURIComponent(term)}`
      );
      const data: Prisma.MessageGetPayload<{}>[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to search messages:", error);
    }
  }, []);

  // Effect for debounced search
  useEffect(() => {
    searchMessages(searchTerm);
  }, [searchMessages, searchTerm]);

  const handleMessageClick = (messageId: string) => {
    onMessageSelectAction(messageId);
    onCloseAction();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative inset-0 bg-white z-10"
    >
      <div className="flex items-center p-4 border-b">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search messages..."
          className="flex-1"
          autoFocus
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseAction}
          className="ml-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 z-50 rounded-md border bg-background shadow-lg"
        >
          {searchTerm && results.length > 0 && (
            <div className="p-4">
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleMessageClick(result.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {(result.senderName || "A").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {result.senderName}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {highlightText(result.text, searchTerm)}
                        </p>
                      </div>
                      <time className="text-xs text-gray-500">
                        {format(new Date(result.createdAt), "MMM d, yyyy")}
                      </time>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {searchTerm && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-500"
            >
              No messages found
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-auto max-h-[calc(100vh-4rem)]"
      >
        {searchTerm && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center text-gray-500"
          >
            No messages found
          </motion.div>
        )}
      </motion.div> */}
    </motion.div>
  );
}

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 rounded px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
