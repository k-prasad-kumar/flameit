"use client";

import { addConversation } from "@/lib/actions/realtime.actions";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const AddConversation = ({
  loginUserId,
  userId,
}: {
  loginUserId: string;
  userId: string;
}) => {
  const router = useRouter();
  const handleConversation = async () => {
    const res = await addConversation(loginUserId, [userId], false);
    if (res?.success) {
      router.push(`/inbox`);
    }
  };
  return (
    <Button
      variant={"secondary"}
      className="w-full"
      onClick={handleConversation}
    >
      Message
    </Button>
  );
};
export default AddConversation;
