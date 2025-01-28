"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { HeartIcon, MessageCircle, SendIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import Saved from "@/components/post/saved";
import TruncateCaption from "./caption-truncate";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import Link from "next/link";

// import CommentReplay from "./comment-reply";
import CommentReplies from "./comment-replies";
import { getRelativeTime } from "@/lib/relative-time";
import HandleProfileFollow from "../profile/handle-follow";
import { ProfileAvatar } from "../avatar";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addPostComment,
  deleteComment,
  getPostById,
  replayComment,
  updatePostLikes,
} from "@/lib/actions/post.actions";
import { PostResponseInterface } from "@/types/types";

const PostInfo = ({
  post,
  userId,
}: {
  post: PostResponseInterface;
  userId: string;
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    post?.likes?.find((like) => like.userId === userId) ? true : false
  );
  //   const [isCommentUpdated, setIsCommentUpdated] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostResponseInterface>(post);
  const [isAnimating, setIsAnimating] = useState(false);
  const [comment, setComment] = useState<string>("");

  const [replay, setReplay] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchUpdatedPost = async () => {
    const updatedPost: (PostResponseInterface | null) | undefined =
      await getPostById(post?.id as string);
    if (!updatedPost) return;
    setPostData(updatedPost);
  };
  // updating post likes
  const updateLikeOnPost = async (isVal: boolean) => {
    setIsLiked(!isLiked);

    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }

    if (isVal) {
      await updatePostLikes(userId, post?.id, "add");
      fetchUpdatedPost();
    } else {
      await updatePostLikes(userId, post?.id, "remove");
      fetchUpdatedPost();
    }

    router.refresh();
  };

  // adding & updating comments
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    startTransition(() => {
      addPostComment(comment, userId, postData?.id)
        .then((data) => {
          if (data?.success) {
            setComment("");
            fetchUpdatedPost();
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // replay to the comment
  const handleReplaySubmit = (id: string) => {
    if (!replay) return;
    startTransition(() => {
      replayComment(replay, userId, postData?.id, id)
        .then((data) => {
          if (data?.success) {
            setReplay("");
            setOpen(false);
            fetchUpdatedPost();
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  //delete comment
  const deleteCommentHandler = async (id: string) => {
    startTransition(() => {
      deleteComment(id, postData?.id)
        .then((data) => {
          if (data?.success) {
            fetchUpdatedPost();
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-5 my-4 px-3 md:px-0">
        <div className="flex items-center space-x-1 md:space-x-4">
          <div className="flex items-center space-x-1">
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
          </div>
          <div className="flex items-center space-x-1">
            <div className="hidden md:block">
              <Dialog>
                <DialogTrigger asChild>
                  <p className="cursor-pointer">
                    <MessageCircle
                      strokeWidth={1.5}
                      size={26}
                      aria-description="Like post"
                    />
                  </p>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex justify-center w-full">
                      Comments
                    </DialogTitle>
                  </DialogHeader>
                  <Separator />
                  <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
                    {postData?.commentsCount === 0 && (
                      <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                        <p className="text-center text-xl pb-2 font-semibold font-sans">
                          No comments yet
                        </p>
                        <p className="text-sm">Start the conversation</p>
                      </div>
                    )}
                    {postData?.comments?.map((comment) => (
                      <div key={comment.id} className="mb-5">
                        <div className="flex justify-between">
                          <Link
                            href={`/${comment?.user?.username}`}
                            className="flex justify-start items-start space-x-3"
                          >
                            <ProfileAvatar
                              image={comment?.user?.image as string}
                              alt="profile"
                              width="10"
                              height="10"
                            />
                          </Link>
                          <div className="w-full flex flex-col items-start justify-start pl-4">
                            <div className="flex gap-2 items-center max-w-[450px]">
                              <TruncateCaption
                                username={comment?.user?.username as string}
                                text={comment?.text as string}
                                maxLength={50}
                              />
                            </div>
                            <div className="flex space-x-4 items-center mt-2">
                              <p className="text-xs opacity-65">
                                {getRelativeTime(new Date(comment?.createdAt))}
                              </p>
                              <p className="text-sm opacity-65 cursor-pointer">
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <button className="text-xs">Reply</button>
                                  </DialogTrigger>

                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Replay</DialogTitle>
                                    </DialogHeader>

                                    <div>
                                      <div className="flex justify-between w-full">
                                        <input
                                          type="text"
                                          className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
                                          placeholder="Add a reply..."
                                          onChange={(e) =>
                                            setReplay(e.target.value)
                                          }
                                          value={replay}
                                        />{" "}
                                        <button
                                          className="flex px-3 items-center text-blue-500"
                                          disabled={isPending}
                                          onClick={() =>
                                            handleReplaySubmit(comment.id)
                                          }
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
                                            <span>Reply</span>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </p>

                              {userId === comment?.userId && (
                                <p className="text-sm opacity-65 cursor-pointer">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <span className="cursor-pointer">
                                        {" "}
                                        <TrashIcon size={14} />
                                      </span>
                                    </DialogTrigger>
                                    <DialogContent className="w-full sm:max-w-[500px]">
                                      <DialogHeader>
                                        <DialogTitle className="flex justify-center w-full">
                                          Delete Comment
                                        </DialogTitle>
                                      </DialogHeader>
                                      <Separator />
                                      <div className="flex flex-col items-center justify-between">
                                        <p>
                                          Are you sure you want to delete this
                                          comment?
                                        </p>
                                        <div className="flex items-center space-x-2 mt-5">
                                          <DialogClose asChild>
                                            <Button
                                              variant={"secondary"}
                                              className="w-full"
                                            >
                                              Cancel
                                            </Button>
                                          </DialogClose>
                                          <Button
                                            variant={"destructive"}
                                            className="w-full"
                                            type="button"
                                            onClick={() =>
                                              deleteCommentHandler(comment.id)
                                            }
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
                                              <span>Delete</span>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </p>
                              )}
                            </div>
                            {comment?.replies?.length > 0 && (
                              <div className="flex text-xs items-center cursor-pointer">
                                <CommentReplies replies={comment?.replies} />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end pl-2 pt-2">
                            {/* <HeartIcon size={14} /> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="fixed bottom-0 left-0 w-full">
                    <Separator />
                    <form
                      className="flex justify-between w-full"
                      onSubmit={handleSubmit}
                    >
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
                </DialogContent>
              </Dialog>
            </div>

            <div className="px-3 md:px-0 md:hidden flex items-center">
              <Drawer>
                <DrawerTrigger>
                  <p className="cursor-pointer">
                    <MessageCircle
                      strokeWidth={1.5}
                      size={28}
                      aria-description="comment post"
                    />
                  </p>
                </DrawerTrigger>
                <DrawerContent className="max-w-full max-h-[80vh] min-h-[80vh] px-4">
                  <DrawerTitle>
                    <p className="text-center mt-6 mb-2">Comments</p>
                  </DrawerTitle>
                  <Separator />
                  <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
                    {postData?.commentsCount === 0 && (
                      <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                        <p className="text-center text-xl pb-2 font-semibold font-sans">
                          No comments yet
                        </p>
                        <p className="text-sm">Start the conversation</p>
                      </div>
                    )}
                    {postData?.comments?.map((comment) => (
                      <div key={comment.id} className="mb-5">
                        <div className="flex justify-between">
                          <Link
                            href={`/${comment?.user?.username}`}
                            className="flex justify-start items-start space-x-3"
                          >
                            <ProfileAvatar
                              image={comment?.user?.image as string}
                              alt="profile"
                              width="10"
                              height="10"
                            />
                          </Link>
                          <div className="w-full flex flex-col items-start justify-start pl-4">
                            <div className="flex gap-2 items-center max-w-[450px]">
                              <TruncateCaption
                                username={comment?.user?.username as string}
                                text={comment?.text as string}
                                maxLength={50}
                              />
                            </div>
                            <div className="flex space-x-4 items-center mt-2">
                              <p className="text-xs opacity-65">
                                {getRelativeTime(new Date(comment?.createdAt))}
                              </p>
                              <p className="text-sm opacity-65 cursor-pointer">
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <button className="text-xs">Reply</button>
                                  </DialogTrigger>

                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Replay</DialogTitle>
                                    </DialogHeader>

                                    <div>
                                      <div className="flex justify-between w-full">
                                        <input
                                          type="text"
                                          className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
                                          placeholder="Add a reply..."
                                          onChange={(e) =>
                                            setReplay(e.target.value)
                                          }
                                          value={replay}
                                        />{" "}
                                        <button
                                          className="flex px-3 items-center text-blue-500"
                                          disabled={isPending}
                                          onClick={() =>
                                            handleReplaySubmit(comment.id)
                                          }
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
                                            <span>Reply</span>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </p>

                              {userId === comment?.userId && (
                                <p className="text-sm opacity-65 cursor-pointer">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <span className="cursor-pointer">
                                        {" "}
                                        <TrashIcon size={14} />
                                      </span>
                                    </DialogTrigger>
                                    <DialogContent className="w-full sm:max-w-[500px]">
                                      <DialogHeader>
                                        <DialogTitle className="flex justify-center w-full">
                                          Delete Comment
                                        </DialogTitle>
                                      </DialogHeader>
                                      <Separator />
                                      <div className="flex flex-col items-center justify-between">
                                        <p>
                                          Are you sure you want to delete this
                                          comment?
                                        </p>
                                        <div className="flex items-center space-x-2 mt-5">
                                          <DialogClose asChild>
                                            <Button
                                              variant={"secondary"}
                                              className="w-full"
                                            >
                                              Cancel
                                            </Button>
                                          </DialogClose>
                                          <Button
                                            variant={"destructive"}
                                            className="w-full"
                                            type="button"
                                            onClick={() =>
                                              deleteCommentHandler(comment.id)
                                            }
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
                                              <span>Delete</span>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </p>
                              )}
                            </div>
                            {comment?.replies?.length > 0 && (
                              <div className="flex text-xs items-center cursor-pointer">
                                <CommentReplies replies={comment?.replies} />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end pl-2 pt-2">
                            {/* <HeartIcon size={14} /> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="fixed bottom-0 left-0 w-full">
                    <Separator />
                    <form
                      className="flex justify-between w-full"
                      onSubmit={handleSubmit}
                    >
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
                  <DrawerFooter></DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <SendIcon
              strokeWidth={1.5}
              size={28}
              aria-description="Share post"
            />
          </div>
        </div>
        <div className="cursor-pointer">
          <Saved
            userId={userId as string}
            postId={post?.id}
            savedBy={post?.savedBy}
          />
        </div>
      </div>
      {postData?.likesCount === 0 && (
        <p className="text-sm opacity-80 px-3 md:px-0">
          Be the first one to like this
        </p>
      )}

      {postData?.likesCount > 0 && (
        <div className="mb-1 hidden md:block">
          <Dialog>
            <DialogTrigger asChild>
              <p className="px-3 md:px-0 cursor-pointer font-semibold opacity-80">
                {postData?.likesCount} likes
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
                {postData?.likesCount === 0 && (
                  <div className="flex items-center justify-center w-full min-h-full">
                    <p>Be the first to like this post</p>
                  </div>
                )}
                {postData?.likesCount > 0 &&
                  postData?.likes?.map((like) => (
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

      {postData?.likesCount > 0 && (
        <div className="my-1 md:hidden">
          <Drawer>
            <DrawerTrigger>
              <p className="px-3 md:px-0 cursor-pointer font-semibold opacity-80 my-2 text-lg">
                {postData?.likesCount} likes
              </p>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh] min-h-[80vh] px-4">
              <DrawerTitle>
                <p className="text-center mt-6 mb-2">Likes</p>
              </DrawerTitle>
              <Separator />
              <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
                {postData?.likesCount === 0 && (
                  <div className="flex items-center justify-center w-full min-h-full">
                    <p>Be the first to like this post</p>
                  </div>
                )}
                {postData?.likesCount > 0 &&
                  postData?.likes?.map((like) => (
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
      {postData?.caption && (
        <div className="px-3 md:px-0">
          <TruncateCaption
            username={postData?.user?.username as string}
            text={postData?.caption as string}
          />
        </div>
      )}

      {postData?.commentsCount > 0 && (
        <div className="hidden md:block mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <p className="cursor-pointer opacity-70">
                View all {postData?.commentsCount} comments
              </p>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex justify-center w-full">
                  Comments
                </DialogTitle>
              </DialogHeader>
              <Separator />
              <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
                {postData?.commentsCount === 0 && (
                  <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                    <p className="text-center text-xl pb-2 font-semibold font-sans">
                      No comments yet
                    </p>
                    <p className="text-sm">Start the conversation</p>
                  </div>
                )}
                {postData?.comments?.map((comment) => (
                  <div key={comment.id} className="mb-5">
                    <div className="flex justify-between">
                      <Link
                        href={`/${comment?.user?.username}`}
                        className="flex justify-start items-start space-x-3"
                      >
                        <ProfileAvatar
                          image={comment?.user?.image as string}
                          alt="profile"
                          width="10"
                          height="10"
                        />
                      </Link>
                      <div className="w-full flex flex-col items-start justify-start pl-4">
                        <div className="flex gap-2 items-center max-w-[450px]">
                          <TruncateCaption
                            username={comment?.user?.username as string}
                            text={comment?.text as string}
                            maxLength={50}
                          />
                        </div>
                        <div className="flex space-x-4 items-center mt-2">
                          <p className="text-xs opacity-65">
                            {getRelativeTime(new Date(comment?.createdAt))}
                          </p>
                          <p className="text-sm opacity-65 cursor-pointer">
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogTrigger asChild>
                                <button className="text-xs">Reply</button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Replay</DialogTitle>
                                </DialogHeader>

                                <div>
                                  <div className="flex justify-between w-full">
                                    <input
                                      type="text"
                                      className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
                                      placeholder="Add a reply..."
                                      onChange={(e) =>
                                        setReplay(e.target.value)
                                      }
                                      value={replay}
                                    />{" "}
                                    <button
                                      className="flex px-3 items-center text-blue-500"
                                      disabled={isPending}
                                      onClick={() =>
                                        handleReplaySubmit(comment.id)
                                      }
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
                                        <span>Reply</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </p>

                          {userId === comment?.userId && (
                            <p className="text-sm opacity-65 cursor-pointer">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <span className="cursor-pointer">
                                    {" "}
                                    <TrashIcon size={14} />
                                  </span>
                                </DialogTrigger>
                                <DialogContent className="w-full sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle className="flex justify-center w-full">
                                      Delete Comment
                                    </DialogTitle>
                                  </DialogHeader>
                                  <Separator />
                                  <div className="flex flex-col items-center justify-between">
                                    <p>
                                      Are you sure you want to delete this
                                      comment?
                                    </p>
                                    <div className="flex items-center space-x-2 mt-5">
                                      <DialogClose asChild>
                                        <Button
                                          variant={"secondary"}
                                          className="w-full"
                                        >
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        variant={"destructive"}
                                        className="w-full"
                                        type="button"
                                        onClick={() =>
                                          deleteCommentHandler(comment.id)
                                        }
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
                                          <span>Delete</span>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </p>
                          )}
                        </div>
                        {comment?.replies?.length > 0 && (
                          <div className="flex text-xs items-center cursor-pointer">
                            <CommentReplies replies={comment?.replies} />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pl-2 pt-2">
                        {/* <HeartIcon size={14} /> */}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="fixed bottom-0 left-0 w-full">
                <Separator />
                <form
                  className="flex justify-between w-full"
                  onSubmit={handleSubmit}
                >
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
            </DialogContent>
          </Dialog>
        </div>
      )}

      {postData?.commentsCount > 0 && (
        <div className="px-3 md:px-0 md:hidden flex items-center mt-2">
          <Drawer>
            <DrawerTrigger>
              <p className="cursor-pointer opacity-70">
                View all {postData?.commentsCount} comments
              </p>
            </DrawerTrigger>
            <DrawerContent className="max-w-full max-h-[80vh] min-h-[80vh] px-4">
              <DrawerTitle>
                <p className="text-center mt-6 mb-2">Comments</p>
              </DrawerTitle>
              <Separator />
              <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
                {postData?.commentsCount === 0 && (
                  <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                    <p className="text-center text-xl pb-2 font-semibold font-sans">
                      No comments yet
                    </p>
                    <p className="text-sm">Start the conversation</p>
                  </div>
                )}
                {postData?.comments?.map((comment) => (
                  <div key={comment.id} className="mb-5">
                    <div className="flex justify-between">
                      <Link
                        href={`/${comment?.user?.username}`}
                        className="flex justify-start items-start space-x-3"
                      >
                        <ProfileAvatar
                          image={comment?.user?.image as string}
                          alt="profile"
                          width="10"
                          height="10"
                        />
                      </Link>
                      <div className="w-full flex flex-col items-start justify-start pl-4">
                        <div className="flex gap-2 items-center max-w-[450px]">
                          <TruncateCaption
                            username={comment?.user?.username as string}
                            text={comment?.text as string}
                            maxLength={50}
                          />
                        </div>
                        <div className="flex space-x-4 items-center mt-2">
                          <p className="text-xs opacity-65">
                            {getRelativeTime(new Date(comment?.createdAt))}
                          </p>
                          <p className="text-sm opacity-65 cursor-pointer">
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogTrigger asChild>
                                <button className="text-xs">Reply</button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Replay</DialogTitle>
                                </DialogHeader>

                                <div>
                                  <div className="flex justify-between w-full">
                                    <input
                                      type="text"
                                      className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
                                      placeholder="Add a reply..."
                                      onChange={(e) =>
                                        setReplay(e.target.value)
                                      }
                                      value={replay}
                                    />{" "}
                                    <button
                                      className="flex px-3 items-center text-blue-500"
                                      disabled={isPending}
                                      onClick={() =>
                                        handleReplaySubmit(comment.id)
                                      }
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
                                        <span>Reply</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </p>

                          {userId === comment?.userId && (
                            <p className="text-sm opacity-65 cursor-pointer">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <span className="cursor-pointer">
                                    {" "}
                                    <TrashIcon size={14} />
                                  </span>
                                </DialogTrigger>
                                <DialogContent className="w-full sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle className="flex justify-center w-full">
                                      Delete Comment
                                    </DialogTitle>
                                  </DialogHeader>
                                  <Separator />
                                  <div className="flex flex-col items-center justify-between">
                                    <p>
                                      Are you sure you want to delete this
                                      comment?
                                    </p>
                                    <div className="flex items-center space-x-2 mt-5">
                                      <DialogClose asChild>
                                        <Button
                                          variant={"secondary"}
                                          className="w-full"
                                        >
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        variant={"destructive"}
                                        className="w-full"
                                        type="button"
                                        onClick={() =>
                                          deleteCommentHandler(comment.id)
                                        }
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
                                          <span>Delete</span>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </p>
                          )}
                        </div>
                        {comment?.replies?.length > 0 && (
                          <div className="flex text-xs items-center cursor-pointer">
                            <CommentReplies replies={comment?.replies} />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pl-2 pt-2">
                        {/* <HeartIcon size={14} /> */}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="fixed bottom-0 left-0 w-full">
                <Separator />
                <form
                  className="flex justify-between w-full"
                  onSubmit={handleSubmit}
                >
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
              <DrawerFooter></DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
};
export default PostInfo;
