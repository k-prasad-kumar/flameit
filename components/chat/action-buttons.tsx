"use client";

import { ReplyIcon, SmileIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const ActionButtons = ({
  messageId,
  messageText,
  messageUsername,
  messageSenderId,
  isPost,
  image,
  handleUnsend,
  handleReact,
  setReplyTo,
  isPending,
  isUnsended,
}: {
  messageId: string;
  messageText: string;
  messageUsername: string | null;
  messageSenderId: string;
  isPost: boolean;
  image: string | null;
  handleUnsend: (id: string) => void;
  handleReact: (id: string, emoji: string) => void;
  setReplyTo: (message: {
    id: string;
    text: string;
    username: string;
    userId: string;
    image: string | null;
  }) => void;
  isPending: boolean;
  isUnsended: boolean;
}) => {
  // State to control the mobile Dialog open/close
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      {/* unsend button */}
      {isUnsended && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={"link"}
                className="px-2 py-0"
                onClick={() => handleUnsend(messageId)}
                disabled={isPending}
              >
                <span className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                  <TrashIcon />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Unsend</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* reply button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant={"link"}
              className="px-2 py-0"
              onClick={() =>
                setReplyTo({
                  id: messageId,
                  text: isPost ? "Attachment" : messageText,
                  username: messageUsername as string,
                  userId: messageSenderId,
                  image: isPost ? image : null,
                })
              }
            >
              <span className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                <ReplyIcon />
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* react button */}

      <div className="md:hidden">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button
              asChild
              variant={"link"}
              className="px-2 py-0 rounded"
              onClick={() => setDialogOpen(true)}
            >
              <span className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded px-1">
                <SmileIcon />
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div className="p-2 flex justify-between w-full">
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => {
                  handleReact(messageId, "❤️");
                  setDialogOpen(false);
                }}
              >
                ❤️
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => {
                  handleReact(messageId, "😂");
                  setDialogOpen(false);
                }}
              >
                😂
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => {
                  handleReact(messageId, "😮");
                  setDialogOpen(false);
                }}
              >
                😮
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => {
                  handleReact(messageId, "😢");
                  setDialogOpen(false);
                }}
              >
                😢
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => {
                  handleReact(messageId, "😡");
                  setDialogOpen(false);
                }}
              >
                😡
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => {
                  handleReact(messageId, "👍");
                  setDialogOpen(false);
                }}
              >
                👍
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden md:block">
        <HoverCard>
          <HoverCardTrigger>
            <Button asChild variant={"link"} className="px-2 py-0 rounded">
              <span className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded px-1">
                <SmileIcon />
              </span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit p-0 rounded-full">
            <div className="p-2 border flex gap-2 rounded-full">
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => handleReact(messageId, "❤️")}
              >
                ❤️
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => handleReact(messageId, "😂")}
              >
                😂
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => handleReact(messageId, "😮")}
              >
                😮
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => handleReact(messageId, "😢")}
              >
                😢
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => handleReact(messageId, "😡")}
              >
                😡
              </div>
              <div
                className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                onClick={() => handleReact(messageId, "👍")}
              >
                👍
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </>
  );
};
export default ActionButtons;
