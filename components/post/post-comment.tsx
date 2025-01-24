"use client";

import { addPostComment } from "@/lib/actions/post.actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const PostComment = ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
  parentCommentId?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    startTransition(() => {
      addPostComment(comment, userId, postId)
        .then((data) => {
          if (data?.success) {
            setComment("");
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div>
      <form className="flex justify-between w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
          placeholder="Add a comment..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />{" "}
        <button
          className="flex px-3 items-center text-blue-500"
          disabled={isPending}
        >
          Post
        </button>
      </form>
    </div>
  );
};
export default PostComment;
