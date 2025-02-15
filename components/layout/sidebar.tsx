"use client";

import { useEffect, useState } from "react";
import { HomeIcon, MessageCircle, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { ProfileAvatar } from "../avatar";
import { useSocket } from "@/context/use.socket";
import { getUnseenCount } from "@/lib/actions/realtime.actions";
import { MessageInterface } from "@/types/types";

const Sidebar = ({
  userId,
  username,
  userImage,
}: {
  userId: string;
  username: string;
  userImage: string;
}) => {
  const [unseenCount, setUnseenCount] = useState<number>(0);
  const socket = useSocket();

  // Function to fetch the updated unseen messages count.
  const fetchUnseenCount = async () => {
    try {
      const res = await getUnseenCount(userId);
      if (res?.success) {
        console.log("Updated unseen count:", res?.count);
        setUnseenCount(res.count);
      }
    } catch (error) {
      console.error("Error fetching unseen count:", error);
    }
  };

  // Fetch unseen count when the Sidebar mounts and when the window gains focus.
  useEffect(() => {
    fetchUnseenCount();
    window.addEventListener("focus", fetchUnseenCount);
    return () => {
      window.removeEventListener("focus", fetchUnseenCount);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Listen for the custom "messagesSeen" event.
  useEffect(() => {
    const handleMessagesSeen = () => {
      fetchUnseenCount();
    };
    window.addEventListener("messagesSeen", handleMessagesSeen);
    return () => {
      window.removeEventListener("messagesSeen", handleMessagesSeen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for the "newMessage" event to update the unseen count.
  useEffect(() => {
    if (!socket) return;
    if (socket.connected) {
      const handleNewMessage = (data: { newMessage: MessageInterface }) => {
        if (data.newMessage.senderId !== userId) {
          fetchUnseenCount();
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userId]);

  return (
    <div className="fixed left-1/2 bottom-0 -translate-x-1/2 md:left-9 md:top-1/2 md:-translate-y-1/2 px-3 flex md:flex-col justify-between md:justify-around items-center w-full md:w-fit bg-white dark:bg-black border-t md:border-none py-1">
      <Link
        href="/"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg"
      >
        <HomeIcon size={36} strokeWidth={1.5} />
      </Link>
      <Link
        href="/search"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg"
      >
        <SearchIcon size={36} strokeWidth={1.5} />
      </Link>
      <div className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-center">
        <Link
          href={`/create-post`}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg"
        >
          <PlusIcon size={36} strokeWidth={1.5} />
        </Link>
      </div>
      <Link
        href="/inbox"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg relative"
      >
        <MessageCircle size={36} strokeWidth={1.5} />
        {unseenCount > 0 && (
          <div className="absolute top-1 right-2 bg-red-500 rounded-full text-white text-xs font-bold w-5 h-5 flex items-center justify-center">
            {unseenCount}
          </div>
        )}
      </Link>
      <Link href={`/${username}`}>
        <div className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg cursor-pointer">
          <ProfileAvatar
            image={userImage ? userImage : "https://github.com/shadcn.png"}
            alt="profile"
            width="8"
            height="8"
          />
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
