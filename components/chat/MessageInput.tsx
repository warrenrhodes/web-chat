import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { memo } from "react";

interface MessageInputProps {
  onSubmit: () => void;
  editingMessageId: string | null;
  newMessageRef: React.RefObject<HTMLInputElement>;
  onCancelEdit: () => void;
}

export const MessageInput = memo(
  ({
    onSubmit,
    editingMessageId,
    newMessageRef,
    onCancelEdit,
  }: MessageInputProps) => {
    return (
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="p-4 bg-white border-t"
      >
        <div className="flex space-x-2">
          {editingMessageId ? (
            <>
              <Input
                // value={editText || ""}
                ref={newMessageRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                // onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your message..."
                className="flex-1"
              />
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Input
                ref={newMessageRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </motion.form>
    );
  }
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
