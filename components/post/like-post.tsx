"use client";

import { updatePostLikes } from "@/lib/actions/post.actions";
import { Like } from "@/types/types";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LikePost = ({
  postId,
  userId,
  likes,
}: {
  postId: string;
  userId: string;
  likes: Like[];
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    likes?.find((like) => like.userId === userId) ? true : false
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const updateLikeOnPost = async (isVal: boolean) => {
    setIsLiked(!isLiked);

    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }

    if (isVal) {
      await updatePostLikes(userId, postId, "add");
    } else {
      await updatePostLikes(userId, postId, "remove");
    }

    router.refresh();
  };
  return (
    <div className="flex items-center space-x-1">
      <HeartIcon
        className={`cursor-pointer ${isLiked ? "fill-red-500" : ""} ${
          isAnimating ? "animate-pop" : ""
        }`}
        strokeWidth={isLiked ? 0 : 1.5}
        size={isLiked ? 30 : 28}
        onClick={() => updateLikeOnPost(!isLiked)}
        id="heart"
        aria-description="Like post"
      />
    </div>
  );
};
export default LikePost;
