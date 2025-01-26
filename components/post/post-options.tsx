"use client";

import {
  EllipsisIcon,
  ExternalLinkIcon,
  LinkIcon,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import UpdatePost from "./update-post";
import DeletePost from "./delete-post";
import CopyLinkButton from "../copy-to-clipboard";
import { useCallback, useEffect, useState } from "react";
import {
  addFollower,
  isFollowing,
  removeFollower,
} from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PostOptions = ({
  userId,
  postUserId,
  username,
  image,
  postId,
  postImage,
  caption,
}: {
  userId: string;
  postUserId: string;
  username: string;
  image: string;
  postId: string;
  postImage: string;
  caption: string;
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
    <div className="ml-4 md:ml-0">
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <EllipsisIcon strokeWidth={1.5} />
        </DialogTrigger>
        <DialogContent className="flex flex-col justify-center items-center gap-5 md:max-w-2/3">
          <DialogTitle></DialogTitle>
          <div className="space-y-4">
            {userId !== postUserId && (
              <>
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
              </>
            )}

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
            <div>
              <Link href={`/p/${postId}`} className="cursor-pointer">
                <p className="flex items-center gap-3">
                  <ExternalLinkIcon size={18} strokeWidth={1.5} />
                  <span>Go to post</span>
                </p>
              </Link>
            </div>
            {userId === postUserId && (
              <div className="flex flex-col gap-3">
                <UpdatePost
                  username={username}
                  image={image}
                  postId={postId}
                  postImage={postImage}
                  caption={caption}
                />
                <DeletePost postId={postId} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PostOptions;
