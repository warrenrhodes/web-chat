import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { UserInfo } from "@/components/layout/UserInfo";
import { Button } from "../ui/button";
import SearchBar from "./SearchBar";
import { useAuthStore } from "@/hooks/auth-store";

interface ChatHeaderProps {
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  chatId: string | null;
  onMessageSelect: (messageId: string) => void;
}

export const ChatHeader = ({
  isSearching,
  setIsSearching,
  chatId,
  onMessageSelect,
}: ChatHeaderProps) => {
  const { chatWithUser } = useAuthStore();
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
            {chatWithUser && (
              <UserInfo
                user={{
                  avatar: chatWithUser?.photoURL ?? "",
                  email: chatWithUser?.email ?? "",
                  name: chatWithUser?.name ?? "",
                }}
              />
            )}
            {chatWithUser && (
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
