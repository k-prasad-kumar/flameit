"use client";

import { addConversation } from "@/lib/actions/realtime.actions";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

const AddConversation = ({
  loginUserId,
  userId,
}: {
  loginUserId: string;
  userId: string;
}) => {
  const [messageLoading, setMessageLoading] = useState(false);
  const router = useRouter();
  const handleConversation = async () => {
    setMessageLoading(true);
    const res = await addConversation(
      loginUserId,
      [loginUserId, userId],
      false
    );
    if (res?.success) {
      router.push(`/inbox/${res?.conversationId}`);
      setMessageLoading(false);
    }
  };
  return (
    <Button
      variant={"secondary"}
      className="w-full"
      onClick={handleConversation}
    >
      {messageLoading ? (
        <Loader2Icon className="animate-spin" size={18} />
      ) : (
        "Message"
      )}
    </Button>
  );
};
export default AddConversation;
