"use client";

import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { updateSavedPost } from "@/lib/actions/user.actions";
import { savedBy } from "@/types/types";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const Saved = ({
  userId,
  postId,
  savedBy,
}: {
  userId: string;
  postId: string;
  savedBy: savedBy[];
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(
    savedBy?.find((value) => value.userId === userId) ? true : false
  );

  const { theme } = useTheme();
  const handleSaved = (isVal: boolean) => {
    setIsSaved(!isSaved);

    if (isVal) {
      updateSavedPost(userId, postId, "add").then((data) => {
        if (data?.success) {
          setIsSaved(!isSaved);
          toast.success(data?.success);
        }
      });
    } else {
      updateSavedPost(userId, postId, "remove").then((data) => {
        if (data?.success) {
          setIsSaved(!isSaved);
          toast.success(data?.success);
        }
      });
    }
  };

  return (
    <button onClick={() => handleSaved(!isSaved)}>
      <BookmarkIcon
        strokeWidth={1.5}
        size={28}
        fill={isSaved ? (theme === "dark" ? "#ffffff" : "#000000") : "none"}
        aria-description="Save post"
      />
    </button>
  );
};
export default Saved;
