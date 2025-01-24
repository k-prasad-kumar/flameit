"use client";

import { Replay } from "@/types/types";
import { MinusIcon } from "lucide-react";
import React, { useState } from "react";
import TruncateCaption from "./caption-truncate";
import { ProfileAvatar } from "../avatar";
import Link from "next/link";
import { getRelativeTime } from "@/lib/relative-time";

const CommentReplies = ({ replies }: { replies: Replay[] }) => {
  const [showFull, setShowFull] = useState(false);

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
          <div key={reply.id} className="w-full mb-3">
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
                <p className="text-[10px] opacity-65 mt-2">
                  {getRelativeTime(new Date(reply?.createdAt))}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CommentReplies;
