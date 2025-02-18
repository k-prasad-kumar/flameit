"use client";

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

import { MessageCircle } from "lucide-react";
import { formatLikes } from "@/lib/format-likes-count";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { ProfileAvatar } from "../avatar";
import Link from "next/link";
import TruncateCaption from "@/components/post/caption-truncate";
import { getRelativeTime } from "@/lib/relative-time";
import { StoryComment } from "@/types/types";

const StoryComments = ({ comments }: { comments: StoryComment[] }) => {
  return (
    <div>
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <p className="cursor-pointer flex items-center gap-1">
              <MessageCircle
                strokeWidth={1.5}
                size={30}
                aria-description="reply story"
              />
              <span className="text-lg">{formatLikes(comments.length)}</span>
            </p>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-center w-full">
                Replies
              </DialogTitle>
            </DialogHeader>
            <Separator />
            <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
              {comments.length === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                  <p className="text-center text-xl pb-2 font-semibold font-sans">
                    No replies yet
                  </p>
                  <p className="text-sm">
                    When someone replies, it will show here
                  </p>
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
                        width="12"
                        height="12"
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
                      <div className="flex space-x-4 items-center">
                        <p className="text-xs opacity-65">
                          {getRelativeTime(new Date(comment?.createdAt))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="md:hidden flex items-center">
        <Drawer>
          <DrawerTrigger>
            <p className="cursor-pointer flex items-center gap-1">
              <MessageCircle
                strokeWidth={1.5}
                size={30}
                aria-description="reply story"
              />
              <span className="text-lg font-semibold">
                {formatLikes(comments.length)}
              </span>
            </p>
          </DrawerTrigger>
          <DrawerContent className="max-w-full max-h-[80vh] min-h-[80vh] px-4">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Comments</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[70vh] py-2 mb-8">
              {comments.length === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                  <p className="text-center text-xl pb-2 font-semibold font-sans">
                    No replies yet
                  </p>
                  <p className="text-sm">
                    When someone replies, it will show here
                  </p>
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
                        width="12"
                        height="12"
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
                      <div className="flex space-x-4 items-center">
                        <p className="text-xs opacity-65">
                          {getRelativeTime(new Date(comment?.createdAt))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
export default StoryComments;
