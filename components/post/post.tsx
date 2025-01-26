import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import { MessageCircle, SendIcon, TrashIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

import { Button } from "@/components/ui/button";
import { PostResponseInterface } from "@/types/types";
import LikePost from "@/components/post/like-post";

import Saved from "@/components/post/saved";
import TruncateCaption from "./caption-truncate";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import Link from "next/link";

import PostComment from "./post-comment";
import DeleleComment from "./delete-comment";
import CommentReplay from "./comment-reply";
import CommentReplies from "./comment-replies";
import { getRelativeTime } from "@/lib/relative-time";
import PostOptions from "./post-options";
import HandleProfileFollow from "../profile/handle-follow";

const PostsCard = ({
  posts,
  userId,
}: {
  posts: PostResponseInterface[];
  userId: string;
}) => {
  return (
    <div>
      {posts.length > 0 &&
        posts.map((post) => (
          <div className="w-full pb-4 md:pb-5" key={post?.id}>
            <div className="w-full py-2 md:py-3 px-3 md:px-0 flex justify-between items-center">
              <Link
                href={`/${post?.user?.username}`}
                className="flex items-center space-x-3"
              >
                <ProfileAvatar
                  image={post?.user?.image as string}
                  alt="profile"
                  width="10"
                  height="10"
                />
                <div className="flex flex-col">
                  <h2 className="font-semibold">{post?.user?.username}</h2>
                </div>
              </Link>
              <PostOptions
                userId={userId}
                postUserId={post?.user?.id as string}
                username={post?.user?.username as string}
                image={post?.user?.image as string}
                postId={post?.id}
                postImage={post?.images[0]?.url as string}
                caption={post?.caption as string}
              />
            </div>
            <Carousel
              className={` w-full h-full max-w-full ${
                post.images.length > 0 ? "flex" : "hidden"
              } justify-center shadow items-center relative border`}
            >
              <CarouselContent>
                {post?.images?.length > 0 &&
                  post?.images?.map(
                    (image: { url: string; public_id: string }) => (
                      <CarouselItem key={image.public_id}>
                        <div className="flex aspect-square items-center justify-center">
                          <Image
                            src={`${image.url}`}
                            width={100}
                            height={100}
                            sizes="100%"
                            loading="lazy"
                            className="w-auto h-[550px] object-cover"
                            alt="post"
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
              </CarouselContent>
              {post?.images?.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex absolute bottom-[50%] left-3" />
                  <CarouselNext className="hidden md:flex absolute bottom-[50%] right-2" />
                </>
              )}
            </Carousel>
            <div className="flex items-center justify-between space-x-5 my-4 px-3 md:px-0">
              <div className="flex items-center space-x-1 md:space-x-4">
                <div className="flex items-center space-x-1">
                  <LikePost
                    postId={post?.id}
                    userId={userId}
                    likes={post?.likes}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="hidden md:block">
                    <Dialog>
                      <DialogTrigger asChild>
                        <p className="cursor-pointer">
                          <MessageCircle strokeWidth={1.5} size={26} />
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
                          {post?.commentsCount === 0 && (
                            <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                              <p className="text-center text-xl pb-2 font-semibold font-sans">
                                No comments yet
                              </p>
                              <p className="text-sm">Start the conversation</p>
                            </div>
                          )}
                          {post?.comments?.map((comment) => (
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
                                  <div className="flex gap-2 items-center">
                                    <TruncateCaption
                                      username={
                                        comment?.user?.username as string
                                      }
                                      text={comment?.text as string}
                                      maxLength={50}
                                    />
                                  </div>
                                  <div className="flex space-x-4 items-center mt-2">
                                    <p className="text-xs opacity-65">
                                      {getRelativeTime(
                                        new Date(comment?.createdAt)
                                      )}
                                    </p>
                                    <p className="text-sm opacity-65 cursor-pointer">
                                      <CommentReplay
                                        userId={userId}
                                        postId={post?.id}
                                        parentCommentId={comment.id}
                                      />
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
                                                Are you sure you want to delete
                                                this comment?
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
                                                <DeleleComment
                                                  id={comment.id}
                                                  postId={post?.id}
                                                />
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </p>
                                    )}
                                  </div>
                                  {comment?.replies?.length > 0 && (
                                    <div className="flex text-xs items-center cursor-pointer">
                                      <CommentReplies
                                        replies={comment?.replies}
                                      />
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
                          <PostComment userId={userId} postId={post?.id} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="px-3 md:px-0 md:hidden flex items-center">
                    <Drawer>
                      <DrawerTrigger>
                        <p className="cursor-pointer">
                          <MessageCircle strokeWidth={1.5} size={28} />
                        </p>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[80vh] min-h-[80vh]">
                        <DrawerTitle>
                          <p className="text-center mt-6 mb-2">Comments</p>
                        </DrawerTitle>
                        <Separator />
                        <ScrollArea className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] py-2 mb-8">
                          {post?.commentsCount === 0 && (
                            <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                              <p className="text-center text-xl pb-2 font-semibold font-sans">
                                No comments yet
                              </p>
                              <p className="text-sm">Start the conversation</p>
                            </div>
                          )}
                          {post?.comments?.map((comment) => (
                            <div key={comment.id} className="mb-5 px-3 md:px-0">
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
                                  <div className="flex gap-2 items-center">
                                    <TruncateCaption
                                      username={
                                        comment?.user?.username as string
                                      }
                                      text={comment?.text as string}
                                      maxLength={50}
                                    />
                                  </div>
                                  <div className="flex space-x-4 items-center mt-2">
                                    <p className="text-xs opacity-65">
                                      {getRelativeTime(
                                        new Date(comment?.createdAt)
                                      )}
                                    </p>
                                    <p className="text-sm opacity-65 cursor-pointer">
                                      <CommentReplay
                                        userId={userId}
                                        postId={post?.id}
                                        parentCommentId={comment.id}
                                      />
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
                                                Are you sure you want to delete
                                                this comment?
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
                                                <DeleleComment
                                                  id={comment.id}
                                                  postId={post?.id}
                                                />
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </p>
                                    )}
                                  </div>
                                  {comment?.replies?.length > 0 && (
                                    <div className="flex text-xs items-center cursor-pointer">
                                      <CommentReplies
                                        replies={comment?.replies}
                                      />
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
                          <PostComment userId={userId} postId={post?.id} />
                        </div>
                        <DrawerFooter></DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <SendIcon strokeWidth={1.5} size={28} />
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
            {post?.likesCount === 0 && (
              <p className="text-sm opacity-80 px-3 md:px-0">
                Be the first one to like this
              </p>
            )}

            {post?.likesCount > 0 && (
              <div className="mb-1 hidden md:block">
                <Dialog>
                  <DialogTrigger asChild>
                    <p className="px-3 md:px-0 cursor-pointer font-semibold opacity-80">
                      {post?.likesCount} likes
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
                      {post?.likesCount === 0 && (
                        <div className="flex items-center justify-center w-full min-h-full">
                          <p>Be the first to like this post</p>
                        </div>
                      )}
                      {post?.likesCount > 0 &&
                        post?.likes?.map((like) => (
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

            {post?.likesCount > 0 && (
              <div className="my-1 md:hidden">
                <Drawer>
                  <DrawerTrigger>
                    <p className="px-3 md:px-0 cursor-pointer font-semibold opacity-80">
                      {post?.likesCount} likes
                    </p>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[80vh] min-h-[80vh]">
                    <DrawerTitle>
                      <p className="text-center mt-6 mb-2">Likes</p>
                    </DrawerTitle>
                    <Separator />
                    <ScrollArea className="w-full h-[90vh] max-h-[90vh] my-3">
                      {post?.likes?.map((like) => (
                        <div
                          className="flex items-center justify-between px-4 mb-5"
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
                          <div className="w-fit mr-4">
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
            {post?.caption && (
              <div className="px-3 md:px-0">
                <TruncateCaption
                  username={post?.user?.username as string}
                  text={post?.caption as string}
                />
              </div>
            )}
            {post?.commentsCount > 0 && (
              <div className="hidden md:block mt-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <p className="cursor-pointer opacity-60">
                      View all {post?.commentsCount} comments
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
                      {post?.commentsCount === 0 && (
                        <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                          <p className="text-center text-xl pb-2 font-semibold font-sans">
                            No comments yet
                          </p>
                          <p className="text-sm">Start the conversation</p>
                        </div>
                      )}
                      {post?.comments?.map((comment) => (
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
                              <div className="flex gap-2 items-center">
                                <TruncateCaption
                                  username={comment?.user?.username as string}
                                  text={comment?.text as string}
                                  maxLength={50}
                                />
                              </div>
                              <div className="flex space-x-4 items-center mt-2">
                                <p className="text-xs opacity-65">
                                  {getRelativeTime(
                                    new Date(comment?.createdAt)
                                  )}
                                </p>
                                <p className="text-sm opacity-65 cursor-pointer">
                                  <CommentReplay
                                    userId={userId}
                                    postId={post?.id}
                                    parentCommentId={comment.id}
                                  />
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
                                            <DeleleComment
                                              id={comment.id}
                                              postId={post?.id}
                                            />
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
                      <PostComment userId={userId} postId={post?.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            {post?.commentsCount > 0 && (
              <div className="px-3 md:px-0 md:hidden mt-1">
                <Drawer>
                  <DrawerTrigger>
                    <p className="cursor-pointer opacity-60">
                      View all {post?.commentsCount} comments
                    </p>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[80vh] min-h-[80vh]">
                    <DrawerTitle>
                      <p className="text-center mt-6 mb-2">Comments</p>
                    </DrawerTitle>
                    <Separator />
                    <ScrollArea className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] py-2 mb-8">
                      {post?.commentsCount === 0 && (
                        <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                          <p className="text-center text-xl pb-2 font-semibold font-sans">
                            No comments yet
                          </p>
                          <p className="text-sm">Start the conversation</p>
                        </div>
                      )}
                      {post?.comments?.map((comment) => (
                        <div key={comment.id} className="mb-5 px-3 md:px-0">
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
                              <div className="flex gap-2 items-center">
                                <TruncateCaption
                                  username={comment?.user?.username as string}
                                  text={comment?.text as string}
                                  maxLength={50}
                                />
                              </div>
                              <div className="flex space-x-4 items-center mt-2">
                                <p className="text-xs opacity-65">
                                  {getRelativeTime(
                                    new Date(comment?.createdAt)
                                  )}
                                </p>
                                <p className="text-sm opacity-65 cursor-pointer">
                                  <CommentReplay
                                    userId={userId}
                                    postId={post?.id}
                                    parentCommentId={comment.id}
                                  />
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
                                            <DeleleComment
                                              id={comment.id}
                                              postId={post?.id}
                                            />
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
                      <PostComment userId={userId} postId={post?.id} />
                    </div>
                    <DrawerFooter></DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            )}

            <p className="opacity-60 text-xs mt-2 px-3 md:px-0">
              {getRelativeTime(post?.createdAt)}
            </p>
            <Separator className="mt-10 mb-4" />
          </div>
        ))}
    </div>
  );
};
export default PostsCard;
