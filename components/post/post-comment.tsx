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
          {isPending ? (
            <span
              className={`justify-center items-center ${
                isPending ? "flex" : "hidden"
              }`}
            >
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
            </span>
          ) : (
            <span>Post</span>
          )}
        </button>
      </form>
    </div>
  );
};
export default PostComment;
