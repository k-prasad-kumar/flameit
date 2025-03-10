"use client";

import { Reactions } from "@/types/types";
import { ProfileAvatar } from "../avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";

const MessageReactions = ({
  reactions,
  messageId,
  userId,
  handleReact,
}: {
  reactions: Reactions[];
  messageId: string;
  userId: string;
  handleReact: (id: string, reaction: string) => void;
}) => {
  // This state controls the ping animation
  const [isReacted, setIsReacted] = useState(true);

  // Compute the logged-in user's reaction (if any)
  const myReaction = reactions.find((r) => r.userId === userId);

  useEffect(() => {
    // Trigger the animation when the component mounts or when reactions change
    setIsReacted(true);
    const timer = setTimeout(() => {
      setIsReacted(false);
    }, 1000); // Animate for 1 second
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(reactions)]);

  return (
    <div>
      <div className="hidden md:flex">
        <Dialog>
          <DialogTrigger className="relative">
            {myReaction ? myReaction.reaction : reactions?.[0]?.reaction || ""}
            {isReacted && (
              <span className="animate-ping absolute top-0 left-0 text-lg">
                {myReaction
                  ? myReaction.reaction
                  : reactions?.[0]?.reaction || ""}
              </span>
            )}
          </DialogTrigger>
          <DialogContent className="px-0 w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-center">Reactions</DialogTitle>
            </DialogHeader>
            <Separator />
            <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
              <div>
                {reactions?.map((reaction) => (
                  <div key={reaction.userId}>
                    {reaction.userId !== userId ? (
                      <div className="flex items-center justify-between gap-2 w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800">
                        <div className="flex gap-2 items-center">
                          <ProfileAvatar
                            image={reaction.user?.image as string}
                            alt="profile"
                            width="12"
                            height="12"
                          />
                          <div className="space-y-[1px]">
                            <p className="text-sm">{reaction.user?.name}</p>
                          </div>
                        </div>
                        <p className="text-xl">{reaction.reaction}</p>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between gap-2 cursor-pointer w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() =>
                          handleReact(messageId, reaction.reaction)
                        }
                      >
                        <div className="flex gap-2 items-center">
                          <ProfileAvatar
                            image={reaction.user?.image as string}
                            alt="profile"
                            width="12"
                            height="12"
                          />
                          <div className="space-y-[1px]">
                            <p className="text-sm">{reaction.user?.name}</p>
                            <p className="text-xs opacity-70">
                              Select to remove
                            </p>
                          </div>
                        </div>
                        <p className="text-xl">{reaction.reaction}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex md:hidden">
        <Drawer>
          <DrawerTrigger>
            {myReaction ? myReaction.reaction : reactions?.[0]?.reaction || ""}
            {isReacted && (
              <span className="animate-ping absolute top-0 left-0 text-lg">
                {myReaction
                  ? myReaction.reaction
                  : reactions?.[0]?.reaction || ""}
              </span>
            )}
          </DrawerTrigger>
          <DrawerContent className="max-h-[60vh] min-h-[60vh] px-4">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Reactions</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
              <div>
                {reactions?.map((reaction) => (
                  <div key={reaction.userId}>
                    {reaction.userId !== userId ? (
                      <div className="flex items-center justify-between gap-2 w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800">
                        <div className="flex gap-2 items-center">
                          <ProfileAvatar
                            image={reaction.user?.image as string}
                            alt="profile"
                            width="12"
                            height="12"
                          />
                          <div className="space-y-[1px]">
                            <p className="text-sm">{reaction.user?.name}</p>
                          </div>
                        </div>
                        <p className="text-xl">{reaction.reaction}</p>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between gap-2 cursor-pointer w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() =>
                          handleReact(messageId, reaction.reaction)
                        }
                      >
                        <div className="flex gap-2 items-center">
                          <ProfileAvatar
                            image={reaction.user?.image as string}
                            alt="profile"
                            width="12"
                            height="12"
                          />
                          <div className="space-y-[1px]">
                            <p className="text-sm">{reaction.user?.name}</p>
                            <p className="text-xs opacity-70">
                              Select to remove
                            </p>
                          </div>
                        </div>
                        <p className="text-xl">{reaction.reaction}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default MessageReactions;
