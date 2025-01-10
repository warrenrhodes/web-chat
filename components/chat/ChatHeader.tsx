import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { UserInfo } from "@/components/layout/UserInfo";
import { Button } from "../ui/button";
import { Prisma } from "@prisma/client";
import SearchBar from "./SearchBar";

interface ChatHeaderProps {
  selectedUser: Prisma.UserGetPayload<{}> | null;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  chatId: string | null;
  onMessageSelect: (messageId: string) => void;
}

export const ChatHeader = ({
  selectedUser,
  isSearching,
  setIsSearching,
  chatId,
  onMessageSelect,
}: ChatHeaderProps) => {
  return (
    <div className="bg-white p-4 relative flex-shrink-0 z-10">
      <AnimatePresence>
        {isSearching && chatId ? (
          <SearchBar
            chatId={chatId}
            onCloseAction={() => setIsSearching(false)}
            onMessageSelectAction={onMessageSelect}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-between items-center"
          >
            {selectedUser && (
              <UserInfo
                user={{
                  avatar: selectedUser?.photoURL ?? "",
                  email: selectedUser?.email ?? "",
                  name: selectedUser?.name ?? "",
                }}
              />
            )}
            {selectedUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearching(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ChatHeader.displayName = "ChatHeader";
export default ChatHeader;
