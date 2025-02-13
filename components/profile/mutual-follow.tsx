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
import { Loader2, X } from "lucide-react";
import { addConversation } from "@/lib/actions/realtime.actions";

const FollowActions = ({
  currentUserId,
  profileUserId,
  isLoginUserFollowersPage = false,
}: {
  currentUserId: string; // Logged-in user ID
  profileUserId: string; // Profile owner user ID
  isLoginUserFollowersPage?: boolean; // If this component is used in the followers page context
}) => {
  const [status, setStatus] = useState<{
    following: boolean;
    follower: boolean;
  }>({
    following: false, // Is the logged-in user following the profile user?
    follower: false, // Is the profile user following the logged-in user?
  });
  const [loading, setLoading] = useState(false); // Manage loading states
  const [messageLoading, setMessageLoading] = useState(false); // Manage loading states (messageLoadingse); // Manage loading states
  const router = useRouter();

  const fetchFollowStatus = useCallback(async () => {
    try {
      setLoading(true);
      const isUserFollowing = await isFollowing(currentUserId, profileUserId); // Current user -> Profile user
      const isProfileUserFollowing = await isFollowing(
        profileUserId,
        currentUserId
      ); // Profile user -> Current user
      setStatus({
        following: isUserFollowing,
        follower: isProfileUserFollowing,
      });
    } catch (error) {
      console.error("Error fetching follow status:", error);
      toast.error("Unable to fetch follow status.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, profileUserId]);

  useEffect(() => {
    fetchFollowStatus();
  }, [fetchFollowStatus]);

  const handleFollowAction = async (
    action: "follow" | "unfollow" | "remove"
  ) => {
    try {
      setLoading(true);
      let response;
      if (action === "follow") {
        response = await addFollower(currentUserId, profileUserId);
        if (response?.success) {
          toast.success(response.success);
          setStatus((prev) => ({ ...prev, following: true }));
        }
      } else if (action === "unfollow") {
        response = await removeFollower(currentUserId, profileUserId);
        if (response?.success) {
          toast.success(response.success);
          setStatus((prev) => ({ ...prev, following: false }));
        }
      } else if (action === "remove") {
        // Handle "remove" differently based on the context
        if (isLoginUserFollowersPage) {
          response = await removeFollower(profileUserId, currentUserId); // Remove them as your follower
          if (response?.success) {
            toast.success("Follower removed.");
            setStatus((prev) => ({ ...prev, follower: false }));
          }
        } else {
          response = await removeFollower(currentUserId, profileUserId); // Remove yourself as their follower
          if (response?.success) {
            toast.success("You are no longer following this user.");
            setStatus((prev) => ({ ...prev, following: false }));
          }
        }
      }
      router.refresh(); // Refresh the UI for consistency
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConversation = async (participentId: string) => {
    setMessageLoading(true);
    const res = await addConversation(
      currentUserId,
      [currentUserId, participentId],
      false
    );

    if (res?.success) {
      router.push(`/inbox/${res?.conversationId}`);
      setMessageLoading(false);
    }
  };

  if (currentUserId === profileUserId) return null; // No actions for own profile

  return (
    <div className="flex space-x-2">
      {/* Mutual Following: Show "Message" and "Unfollow" */}
      {status.following && status.follower ? (
        <>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleConversation(profileUserId)}
            disabled={loading}
          >
            {messageLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Message"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-fit border px-2"
            onClick={() => handleFollowAction("unfollow")}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <X />}
          </Button>
        </>
      ) : status.following ? (
        // Following but not followed back: Show "Unfollow"
        <>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleConversation(profileUserId)}
            disabled={loading}
          >
            {messageLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Message"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full border px-2"
            onClick={() => handleFollowAction("unfollow")}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <X />}
          </Button>
        </>
      ) : status.follower ? (
        // Followed but not following back: Show "Follow Back" and "Remove"
        <>
          <Button
            variant="blue"
            className="w-full"
            onClick={() => handleFollowAction("follow")}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Follow Back"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-fit border px-2"
            onClick={() => handleFollowAction("remove")}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <X />}
          </Button>
        </>
      ) : (
        // Neither following nor followed: Show "Follow"
        <Button
          variant="blue"
          className="w-full"
          onClick={() => handleFollowAction("follow")}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default FollowActions;
