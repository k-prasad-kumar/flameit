"use client";

import {
  addFollower,
  isFollowing,
  isPrivateAccount,
  removeFollower,
  removeRequestedFollower,
} from "@/lib/actions/user.actions";
import { Button } from "../ui/button";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define our follow status type.
type FollowStatus = "none" | "requested" | "following";

interface HandleProfileFollowProps {
  userId: string; // Logged-in user ID
  isUserId: string; // Target user ID (profile being viewed)
}

const HandleProfileFollow = ({
  userId,
  isUserId,
}: HandleProfileFollowProps) => {
  const [followStatus, setFollowStatus] = useState<FollowStatus>("none");
  const [targetIsPrivate, setTargetIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if the target account is private.
  const fetchIsPrivate = useCallback(async () => {
    try {
      const isPrivate = await isPrivateAccount(isUserId);
      setTargetIsPrivate(isPrivate as boolean);
    } catch (error) {
      console.error("Error checking private account:", error);
    }
  }, [isUserId]);

  // Check following status.
  const fetchFollowingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await isFollowing(userId, isUserId);
      // Set status to following if true; otherwise, leave it as "none"
      setFollowStatus(status ? "following" : "none");
    } catch (error) {
      console.error("Error fetching following status:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, isUserId]);

  useEffect(() => {
    fetchIsPrivate();
  }, [fetchIsPrivate]);

  useEffect(() => {
    fetchFollowingStatus();
  }, [fetchFollowingStatus]);

  const handleFollow = async (action: "follow" | "unfollow") => {
    try {
      setLoading(true);
      if (action === "follow") {
        const data = await addFollower(userId, isUserId);
        if (data?.success) {
          if (targetIsPrivate) {
            // For private accounts, after a successful follow request, mark as requested.
            setFollowStatus("requested");
            toast.success("Follow request sent");
          } else {
            setFollowStatus("following");
            toast.success("Now following");
          }
        }
      } else if (action === "unfollow") {
        let data;
        if (targetIsPrivate && followStatus === "requested") {
          // For a private account with a pending request, cancel it.
          data = await removeRequestedFollower(userId, isUserId);
        } else {
          // For public accounts or if already following on a private account.
          data = await removeFollower(userId, isUserId);
        }
        if (data?.success) {
          setFollowStatus("none");
          toast.success("Unfollowed successfully");
        }
      }
      setLoading(false);
      router.refresh();
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error("Something went wrong, please try again.");
      setLoading(false);
    }
  };

  // If logged in user and target user are the same, don't show the button.
  if (userId === isUserId) return null;

  // Determine button variant and text.
  let variant: "blue" | "secondary";
  let buttonText: string;

  if (targetIsPrivate) {
    // For private accounts, if no follow exists, show blue "Follow".
    // Only after a request is sent, update to "requested".
    if (followStatus === "none") {
      variant = "blue";
      buttonText = "Follow";
    } else if (followStatus === "requested") {
      variant = "secondary";
      buttonText = "Requested";
    } else if (followStatus === "following") {
      variant = "secondary";
      buttonText = "Following";
    } else {
      variant = "blue";
      buttonText = "Follow";
    }
  } else {
    // For public accounts:
    if (followStatus === "following") {
      variant = "secondary";
      buttonText = "Following";
    } else {
      variant = "blue";
      buttonText = "Follow";
    }
  }

  // onClick: If not following, then follow; otherwise, unfollow/cancel.
  const onClickHandler = () => {
    if (followStatus === "none") {
      handleFollow("follow");
    } else {
      handleFollow("unfollow");
    }
  };

  return (
    <div className="max-w-full w-full ml-4 md:ml-0">
      <Button
        variant={variant}
        className="w-full"
        onClick={onClickHandler}
        disabled={loading}
      >
        {loading ? (
          <span className="flex justify-center items-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
          </span>
        ) : (
          <span>{buttonText}</span>
        )}
      </Button>
    </div>
  );
};

export default HandleProfileFollow;
