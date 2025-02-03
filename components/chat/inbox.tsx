"use client";

import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/use.socket";
import { ConversationInterface } from "@/types/types";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      socket.emit("online-users", userId);
      socket.on("online-users", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });
    } else {
      console.log("socket not connected");
    }

    return () => {
      // Clean up the listener when the component is unmounted
      socket?.off("online-users");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
      {conversations?.map((conversation) => (
        <div className="flex flex-col mx-4" key={conversation?.id}>
          {conversation?.participants.map((participant) => (
            <div key={participant?.userId}>
              {participant?.userId !== userId && (
                <Link
                  href={`/inbox/${conversation?.id}`}
                  className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2"
                  key={participant?.userId}
                >
                  <div className="flex items-center space-x-4 h-fit">
                    <div className="relative">
                      <ProfileAvatar
                        image={participant?.image as string}
                        alt="profile"
                        width="12"
                        height="12"
                      />
                      <div
                        className={`w-4 h-4 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 ${
                          onlineUsers?.includes(participant?.userId)
                            ? "block"
                            : "hidden"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h2 className="truncate">{participant?.username}</h2>
                      <p className="truncate text-xs">
                        {conversation?.lastMessage
                          ? conversation?.lastMessage
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
