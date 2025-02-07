"use client";

import { useSocket } from "@/context/use.socket";
import {
  addPostComment,
  deleteComment,
  getPostComments,
  replayComment,
} from "@/lib/actions/post.actions";
import { Comment } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MessageCircle, TrashIcon } from "lucide-react";
import { formatLikes } from "@/lib/format-likes-count";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { ProfileAvatar } from "../avatar";
import Link from "next/link";
import TruncateCaption from "./caption-truncate";
import { getRelativeTime } from "@/lib/relative-time";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

const DynamicCommentReplies = dynamic(() => import("./comment-replies"));

const PostComment = ({
  postComments,
  postCommentsCount,
  username,
  userId,
  postId,
  postUserId,
}: {
  postComments: Comment[];
  postCommentsCount: number;
  username: string;
  userId: string;
  postId: string;
  postUserId: string;
}) => {
  const [comments, setComments] = useState<Comment[]>(postComments);
  const [comment, setComment] = useState<string>("");
  const [commentsCount, setCommentsCount] = useState<number>(postCommentsCount);
  const [replay, setReplay] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const socket = useSocket();
  const router = useRouter();

  const fetchComments = async () => {
    const newComments = await getPostComments(postId);
    setComments(newComments as Comment[]);
    setCommentsCount(newComments?.length as number);
  };

  // adding & updating comments
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    startTransition(() => {
      addPostComment(comment, userId, postId)
        .then((data) => {
          if (data?.success) {
            setComment("");
            if (!socket) return;
            if (socket && socket.connected) {
              socket.emit("notification", {
                recivers: [postUserId],
                text: `${
                  username ? username : "Someone"
                } commented on your post.`,
              });
            } else {
              console.log("socket not connected");
            }
            fetchComments();
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
      replayComment(replay, userId, postId, id)
        .then((data) => {
          if (data?.success) {
            setReplay("");
            fetchComments();
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
      deleteComment(id, postId)
        .then((data) => {
          if (data?.success) {
            fetchComments();
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
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <p className="cursor-pointer flex items-center gap-1 font-semibold">
              <MessageCircle
                strokeWidth={1.5}
                size={30}
                aria-description="comment post"
              />
              <span>{commentsCount !== 0 && formatLikes(commentsCount)}</span>
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
              {commentsCount === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                  <p className="text-center text-xl pb-2 font-semibold font-sans">
                    No comments yet
                  </p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              )}
              {comments?.map((comment) => (
                <div key={comment?.id} className="mb-5">
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
                        <div className="text-sm opacity-65 cursor-pointer">
                          <AlertDialog>
                            <AlertDialogTrigger className="text-xs">
                              Reply
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  reply to {comment?.user?.username}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
                                    placeholder="Add a reply..."
                                    onChange={(e) => setReplay(e.target.value)}
                                    value={replay}
                                  />{" "}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={isPending}
                                  onClick={() => handleReplaySubmit(comment.id)}
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
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

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
                          <DynamicCommentReplies replies={comment?.replies} />
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
            <p className="cursor-pointer flex items-center gap-1">
              <MessageCircle
                strokeWidth={1.5}
                size={30}
                aria-description="comment post"
              />
              <span className="">
                {commentsCount !== 0 && formatLikes(commentsCount)}
              </span>
            </p>
          </DrawerTrigger>
          <DrawerContent className="max-w-full max-h-[80vh] min-h-[80vh] px-4">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Comments</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
              {commentsCount === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                  <p className="text-center text-xl pb-2 font-semibold font-sans">
                    No comments yet
                  </p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              )}
              {comments?.map((comment) => (
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
                        <div className="text-sm opacity-65 cursor-pointer">
                          <AlertDialog>
                            <AlertDialogTrigger className="text-xs">
                              Reply
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  reply to {comment?.user?.username}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 placeholder:text-sm outline-none border-none"
                                    placeholder="Add a reply..."
                                    onChange={(e) => setReplay(e.target.value)}
                                    value={replay}
                                  />{" "}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={isPending}
                                  onClick={() => handleReplaySubmit(comment.id)}
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
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

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
                          <DynamicCommentReplies replies={comment?.replies} />
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
  );
};
export default PostComment;
