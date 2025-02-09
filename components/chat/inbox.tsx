"use client";

import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/use.socket";
import { ConversationInterface } from "@/types/types";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

const InboxPage = ({
  conversations,
  userId,
}: {
  conversations: ConversationInterface[];
  userId: string;
}) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    if (socket && socket.connected) {
      // Tell the server who is online
      socket.emit("online-users", userId);
      socket.on("online-users", (onlineUsers: string[]) => {
        setOnlineUsers(onlineUsers);
      });
    } else {
      console.log("socket not connected");
    }

    return () => {
      socket?.off("online-users");
    };
  }, [socket, userId]);

  // Sort conversations: online conversations come first,
  // then sort by most recently updated (assuming conversation.updatedAt exists)
  const sortedConversations = useMemo(() => {
    if (!conversations) return [];
    return [...conversations].sort((a, b) => {
      // Check if conversation 'a' has any participant (other than the logged-in user) online
      const aOnline = a.participants.some(
        (p) => p.userId !== userId && onlineUsers.includes(p.userId)
      );
      const bOnline = b.participants.some(
        (p) => p.userId !== userId && onlineUsers.includes(p.userId)
      );

      // If one conversation is online and the other is not, sort accordingly
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;

      // If both have the same online status, sort by updatedAt descending
      // (Assuming conversation.updatedAt is a valid date string)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [conversations, onlineUsers, userId]);

  return (
    <div className="w-full">
      <div className="relative mx-4 my-4">
        <SearchIcon
          strokeWidth={1.5}
          size={18}
          className="absolute top-1/2 -translate-y-1/2 left-3"
        />

        <Input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="pl-10"
        />
      </div>
      {sortedConversations.map((conversation) => (
        <div className="flex flex-col mx-4" key={conversation.id}>
          {conversation.participants.map((participant) => (
            <div key={participant.userId} className="max-w-full">
              {participant.userId !== userId && (
                <Link
                  href={`/inbox/${conversation.id}`}
                  className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2"
                  key={participant.userId}
                >
                  <div className="flex items-center space-x-4 h-fit w-full">
                    <div className="relative w-fit">
                      <ProfileAvatar
                        image={participant.image as string}
                        alt="profile"
                        width="12"
                        height="12"
                      />
                      <div
                        className={`w-4 h-4 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 ${
                          onlineUsers.includes(participant.userId)
                            ? "block"
                            : "hidden"
                        }`}
                      ></div>
                    </div>
                    <div className="w-5/6">
                      <h2 className="truncate">{participant.username}</h2>
                      <p className="truncate text-xs w-full">
                        {conversation.lastMessage
                          ? conversation.lastMessage
                          : ""}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InboxPage;
