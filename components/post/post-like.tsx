import { useSocket } from "@/context/use.socket";
import { updatePostLikes } from "@/lib/actions/post.actions";
import { Like } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HeartIcon } from "lucide-react";
import { formatLikes } from "@/lib/format-likes-count";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { ProfileAvatar } from "../avatar";
import HandleProfileFollow from "../profile/handle-follow";

const PostLike = ({
  postLikes,
  username,
  userId,
  postId,
  postUserId,
  likesCount,
}: {
  postLikes: Like[];
  username: string;
  userId: string;
  postId: string;
  postUserId: string;
  likesCount: number;
}) => {
  const [likes, setLikes] = useState<Like[]>(postLikes);
  const [isLiked, setIsLiked] = useState<boolean>(
    likes?.find((like) => like.userId === userId) ? true : false
  );
  const [likesCountState, setLikesCountState] = useState<number>(likesCount); // ✅ New state for like count
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    setLikesCountState(likes.length);
  }, [likes]);

  const updateLikeOnPost = async (isVal: boolean) => {
    // Optimistically update state
    setIsLiked(!isLiked);

    // Handle animation
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }

    // Call API in the background
    if (isVal) {
      const newLikes = await updatePostLikes(userId, postId, "add");
      setLikes(newLikes as Like[]);
      if (socket && socket.connected) {
        socket.emit("notification", {
          recivers: [postUserId],
          text: `${username ? username : "Someone"} liked your post.`,
        });
      }
    } else {
      const newLikes = await updatePostLikes(userId, postId, "remove");
      setLikes(newLikes as Like[]);
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
        size={isLiked ? 32 : 30}
        onClick={() => updateLikeOnPost(!isLiked)}
        id="heart"
        aria-description="Like post"
      />{" "}
      {likesCount > 0 && (
        <div className="hidden md:block">
          <Dialog>
            <DialogTrigger asChild>
              <p className="cursor-pointer font-semibold opacity-80">
                {likesCountState !== 0 && formatLikes(likesCountState)}
              </p>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex justify-center w-full">
                  Likes
                </DialogTitle>
              </DialogHeader>
              <Separator />
              <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
                {likesCountState === 0 && (
                  <div className="flex items-center justify-center w-full min-h-full">
                    <p>Be the first to like this post</p>
                  </div>
                )}
                {likesCountState > 0 &&
                  likes?.map((like) => (
                    <div
                      className="flex items-center justify-between mb-5"
                      key={like.id}
                    >
                      <div className="flex items-center space-x-3 max-w-4/6">
                        <Link href={`/${like?.user?.username}`}>
                          <ProfileAvatar
                            image={like?.user?.image as string}
                            alt="profile"
                            width="10"
                            height="10"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <Link
                            href={`/${like?.user?.username}`}
                            className="truncate max-w-[180px] sm:max-w-[280px]"
                          >
                            {like?.user?.username}
                          </Link>
                          <p className="truncate max-w-[180px] sm:max-w-[280px] text-xs opacity-65">
                            {like?.user?.name}
                          </p>
                        </div>
                      </div>
                      <div className="w-fit">
                        <HandleProfileFollow
                          userId={userId}
                          isUserId={like?.user?.id}
                        />
                      </div>
                    </div>
                  ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {likesCount > 0 && (
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger>
              <p className="cursor-pointer font-semibold opacity-80">
                {likesCountState !== 0 && formatLikes(likesCountState)}
              </p>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh] min-h-[80vh] px-4">
              <DrawerTitle>
                <p className="text-center mt-6 mb-2">Likes</p>
              </DrawerTitle>
              <Separator />
              <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
                {likesCountState === 0 && (
                  <div className="flex items-center justify-center w-full min-h-full">
                    <p>Be the first to like this post</p>
                  </div>
                )}
                {likesCountState > 0 &&
                  likes?.map((like) => (
                    <div
                      className="flex items-center justify-between mb-5 w-full"
                      key={like.id}
                    >
                      <div className="flex items-center space-x-3">
                        <Link href={`/${like?.user?.username}`}>
                          <ProfileAvatar
                            image={like?.user?.image as string}
                            alt="profile"
                            width="10"
                            height="10"
                          />
                        </Link>
                        <div className="flex flex-col w-full">
                          <Link
                            href={`/${like?.user?.username}`}
                            className="truncate max-w-[180px] sm:max-w-[280px]"
                          >
                            {like?.user?.username}
                          </Link>
                          <p className="truncate max-w-[180px] sm:max-w-[280px] text-xs opacity-65">
                            {like?.user?.name}
                          </p>
                        </div>
                      </div>
                      <div className="mr-4">
                        <HandleProfileFollow
                          userId={userId}
                          isUserId={like?.user?.id}
                        />
                      </div>
                    </div>
                  ))}
              </ScrollArea>
              <DrawerFooter></DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
};
export default PostLike;
