"use client";

import { deleteComment } from "@/lib/actions/post.actions";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const DeleleComment = ({ id, postId }: { id: string; postId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteCommentHandler = async (id: string) => {
    startTransition(() => {
      deleteComment(id, postId)
        .then((data) => {
          if (data?.success) {
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <Button
      variant={"destructive"}
      className="w-full"
      type="button"
      onClick={() => deleteCommentHandler(id)}
      disabled={isPending}
    >
      Delete
    </Button>
  );
};
export default DeleleComment;
