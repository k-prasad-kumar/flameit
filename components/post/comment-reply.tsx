"use client";

import { replayComment } from "@/lib/actions/post.actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const CommentReplay = ({
  userId,
  username,
  postId,
  parentCommentId,
}: {
  userId: string;
  username: string;
  postId: string;
  parentCommentId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [replay, setReplay] = useState<string>(`@${username} `);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      replayComment(replay, userId, postId, parentCommentId)
        .then((data) => {
          if (data?.success) {
            setReplay("");
            setOpen(false);
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>Reply</button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Replay</DialogTitle>
        </DialogHeader>

        <div>
          <form className="flex justify-between w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
              placeholder="Add a comment..."
              onChange={(e) => setReplay(e.target.value)}
              value={replay}
            />{" "}
            <button
              className="flex px-3 items-center text-blue-500"
              disabled={isPending}
            >
              Post
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CommentReplay;
