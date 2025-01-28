"use client";

import {
  EllipsisIcon,
  ExternalLinkIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import CopyLinkButton from "../copy-to-clipboard";
import { useCallback, useEffect, useState } from "react";
import {
  addFollower,
  isFollowing,
  removeFollower,
} from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserPostOptions = ({
  userId,
  postUserId,
  postId,
}: {
  userId: string;
  postUserId: string;
  postId: string;
}) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true); // For showing a loading state
  const router = useRouter();

  const fetchFollowingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await isFollowing(userId, postUserId);
      setFollowing(status);
    } catch (error) {
      console.error("Error fetching following status:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, postUserId]);

  useEffect(() => {
    fetchFollowingStatus();
  }, [fetchFollowingStatus]);

  const handleFollow = async (type: "follow" | "unfollow") => {
    try {
      setFollowing(type === "follow" ? true : false); // Optimistic update
      if (type === "follow") {
        await addFollower(userId, postUserId);
      } else if (type === "unfollow") {
        await removeFollower(userId, postUserId);
      }
      router.refresh();
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      toast.error("Something went wrong, please try again.");
      setFollowing((prev) => !prev); // Revert on error
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2">
          {userId !== postUserId && (
            <DropdownMenuItem>
              {loading ? (
                <div>
                  <span className="justify-center items-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                  </span>
                </div>
              ) : following ? (
                <div
                  className="cursor-pointer"
                  onClick={() => handleFollow("unfollow")}
                >
                  <p className="flex items-center gap-3 text-red-500">
                    <UserRoundMinusIcon size={18} strokeWidth={1.5} />
                    <span>Unfollow</span>
                  </p>
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => handleFollow("follow")}
                >
                  <p className="flex items-center gap-3 text-[#0095f6]">
                    <UserRoundPlusIcon size={18} strokeWidth={1.5} />
                    <span>Follow</span>
                  </p>
                </div>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="hidden lg:block">
            <div className="cursor-pointer">
              <div className="flex items-center gap-3">
                <LinkIcon size={18} strokeWidth={1.5} />
                <div>
                  <CopyLinkButton
                    text={`${process.env.NEXT_PUBLIC_URL}/p/${postId}`}
                  />{" "}
                </div>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/p/${postId}`} className="cursor-pointer">
              <p className="flex items-center gap-3">
                <ExternalLinkIcon size={18} strokeWidth={1.5} />
                <span>Go to post</span>
              </p>
            </Link>
          </DropdownMenuItem>
          {userId === postUserId && (
            <>
              <DropdownMenuItem>
                <Link
                  href={`/p/${postId}/update`}
                  className="cursor-pointer flex items-center gap-3"
                >
                  {" "}
                  <PencilIcon size={18} strokeWidth={1.5} /> Edit{" "}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/p/${postId}/delete`}
                  className="cursor-pointer flex items-center gap-3 text-red-500"
                >
                  {" "}
                  <TrashIcon size={18} strokeWidth={1.5} /> Delete{" "}
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserPostOptions;
