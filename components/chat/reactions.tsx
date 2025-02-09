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
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";

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
        <DialogContent className="px-0">
          <DialogHeader>
            <DialogTitle className="text-center">Reactions</DialogTitle>
          </DialogHeader>
          <Separator />
          <div>
            {reactions?.map((reaction) => (
              <div key={reaction.userId}>
                {reaction.userId !== userId ? (
                  <div className="flex items-center justify-between gap-2 w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800">
                    <div className="flex gap-2 items-center">
                      <ProfileAvatar
                        image={reaction.image as string}
                        alt="profile"
                        width="12"
                        height="12"
                      />
                      <div className="space-y-[1px]">
                        <p className="text-sm">{reaction.name}</p>
                      </div>
                    </div>
                    <p className="text-xl">{reaction.reaction}</p>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between gap-2 cursor-pointer w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                    onClick={() => handleReact(messageId, reaction.reaction)}
                  >
                    <div className="flex gap-2 items-center">
                      <ProfileAvatar
                        image={reaction.image as string}
                        alt="profile"
                        width="12"
                        height="12"
                      />
                      <div className="space-y-[1px]">
                        <p className="text-sm">{reaction.name}</p>
                        <p className="text-xs opacity-70">Select to remove</p>
                      </div>
                    </div>
                    <p className="text-xl">{reaction.reaction}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageReactions;
