"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { deleteConversation } from "@/lib/actions/chat.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TrashIcon } from "lucide-react";

const DeleteChat = ({ conversationId }: { conversationId: string }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(() => {
      deleteConversation(conversationId).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          setOpenDelete(false);
          router.push("/inbox");
        }
      });
    });
  };
  return (
    <div>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger className="flex items-center text-red-500 gap-2 w-full py-1 px-2">
          <TrashIcon strokeWidth={1.5} size={16} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this chat?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <div className="flex justify-end space-x-4">
            <Button variant={"secondary"} onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <span
                  className={`justify-center items-center ${
                    isPending ? "flex" : "hidden"
                  }`}
                >
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                </span>
              ) : (
                <span>Delete</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DeleteChat;
