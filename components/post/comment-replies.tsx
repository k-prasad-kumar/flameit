"use client";

import { Replay } from "@/types/types";
import { HeartIcon, MinusIcon } from "lucide-react";
import React, { useState } from "react";
import TruncateCaption from "./caption-truncate";
import { ProfileAvatar } from "../avatar";
import Link from "next/link";

const CommentReplies = ({ replies }: { replies: Replay[] }) => {
  const [showFull, setShowFull] = useState(false);

  //   const handleToggle = () => {
  //     setShowFull(!showFull);
  //   };

  return (
    <div className="w-full">
      <p className="flex items-center">
        <span className="pr-2">
          <MinusIcon size={38} strokeWidth={0.5} />
        </span>
        <span
          onClick={() => setShowFull(!showFull)}
          className="opacity-60 cursor-pointer"
        >
          {showFull ? "Hide replies" : `View replies (${replies.length})`}
        </span>
      </p>
      {showFull &&
        replies.map((reply) => (
          <div key={reply.id} className="w-full border">
            <div className="flex justify-between w-full">
              <Link
                href={`/${reply?.user?.username}`}
                className="flex justify-start items-start space-x-3"
              >
                <ProfileAvatar
                  image={reply?.user?.image as string}
                  alt="profile"
                  width="6"
                  height="6"
                />
              </Link>
              <div className="w-full flex flex-col items-start justify-start pl-4">
                <div className="flex gap-2 items-center">
                  <TruncateCaption
                    username={reply?.user?.username as string}
                    text={reply?.text as string}
                    maxLength={40}
                  />
                </div>
                <div className="flex space-x-4 items-center">
                  <p className="text-sm opacity-65 cursor-pointer">
                    {/* <CommentReplay
                                  userId={userId}
                                  username={comment?.user?.username as string}
                                  postId={post?.id}
                                  parentCommentId={comment.id}
                                /> */}
                  </p>
                  {/* <p className="text-sm opacity-65 cursor-pointer">
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
                              </p> */}
                </div>
                {/* <div className="flex text-xs opacity-65 items-center cursor-pointer">
                              <CommentReplies replies={comment?.replies} />
                            </div> */}
              </div>
              <div className="flex justify-end pl-2 pt-2">
                <HeartIcon size={14} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CommentReplies;
