"use client";

import {
  addFollower,
  isFollowing,
  removeFollower,
} from "@/lib/actions/user.actions";
import { Button } from "../ui/button";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HandleProfileFollow = ({
  userId,
  isUserId,
}: {
  userId: string;
  isUserId: string;
}) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true); // For showing a loading state
  const router = useRouter();

  const fetchFollowingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await isFollowing(userId, isUserId);
      setFollowing(status);
    } catch (error) {
      console.error("Error fetching following status:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, isUserId]);

  useEffect(() => {
    fetchFollowingStatus();
  }, [fetchFollowingStatus]);

  const handleFollow = async (type: "follow" | "unfollow") => {
    try {
      setFollowing(type === "follow" ? true : false); // Optimistic update
      if (type === "follow") {
        const data = await addFollower(userId, isUserId);
        if (data?.success) {
          toast.success(data?.success);
        }
      } else if (type === "unfollow") {
        const data = await removeFollower(userId, isUserId);
        if (data?.success) {
          toast.success(data?.success);
        }
      }
      router.refresh();
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      toast.error("Something went wrong, please try again.");
      setFollowing((prev) => !prev); // Revert on error
    }
  };

  if (userId === isUserId) return null; // Don't show the button for the same user

  return (
    <div className="max-w-full w-full ml-4 md:ml-0">
      {following ? (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => handleFollow("unfollow")}
          disabled={loading}
        >
          <span
            className={`justify-center items-center ${
              loading ? "flex" : "hidden"
            }`}
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          </span>
          Following
        </Button>
      ) : (
        <Button
          variant="blue"
          className="w-full"
          onClick={() => handleFollow("follow")}
          disabled={loading}
        >
          <span
            className={`justify-center items-center ${
              loading ? "flex" : "hidden"
            }`}
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          </span>
          Follow
        </Button>
      )}
    </div>
  );
};

export default HandleProfileFollow;
