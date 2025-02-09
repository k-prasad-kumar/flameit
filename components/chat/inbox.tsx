"use client";

import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/use.socket";
import { addConversation } from "@/lib/actions/realtime.actions";
import { ConversationInterface, UserInfo } from "@/types/types";
import { CheckIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { toast } from "sonner";

const InboxPage = ({
  conversations,
  userId,
  users,
}: {
  conversations: ConversationInterface[];
  userId: string;
  users: UserInfo[];
}) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [group, setGroup] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const socket = useSocket();
  const router = useRouter();

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

  const handleConversation = async () => {
    if (group.length === 0)
      return toast.error("Please select at least one user to create a group");

    if (groupName.length === 0) return toast.error("Please enter a group name");
    const res = await addConversation(userId, group, true, groupName);

    if (res?.error === "Private conversation already exists") {
      router.push(`/inbox/${res?.conversationId}`);
    }

    if (res?.success) {
      router.push(`/inbox/${res?.conversationId}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-1 items-center">
        <div className="relative mx-4 my-4 w-full">
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
        <div>
          <Dialog>
            <DialogTrigger>
              <span className="border mr-4 px-4 py-2 rounded cursor-pointer flex gap-1 text-sm">
                <PlusIcon size={20} />
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="items-center">
                <DialogTitle>Create Group</DialogTitle>
              </DialogHeader>
              <Separator />
              <div>
                <ScrollArea className="w-full h-[50vh] md:h-[50vh]">
                  <div>
                    {users?.map((user) => (
                      <div
                        key={user.id}
                        className="flex justify-between md:px-4 py-2 cursor-pointer md:hover:bg-gray-100 md:dark:hover:bg-gray-800 my-2"
                        onClick={() => {
                          if (group.includes(user.id)) {
                            setGroup(group.filter((id) => id !== user.id));
                          } else {
                            setGroup([...group, user.id]);
                          }
                        }}
                      >
                        <div className="flex gap-3 truncate items-center">
                          <ProfileAvatar
                            image={user.image as string}
                            alt="profile"
                            width="12"
                            height="12"
                          />
                          <p>{user.username}</p>
                        </div>
                        <div className="flex items-center">
                          {group.includes(user.id) ? (
                            <CheckIcon
                              className="rounded-full bg-[#0095f6] p-[2px]"
                              size={24}
                              color="white"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button className="w-full mt-2" onClick={handleConversation}>
                    Create group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {sortedConversations.map((conversation) => (
        <div className="flex flex-col mx-4" key={conversation.id}>
          {conversation.isGroup ? (
            <div className="my-1">
              <Link
                href={`/inbox/${conversation.id}`}
                className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2"
              >
                <div className="flex items-center space-x-4 h-fit w-full">
                  <div className="relative w-fit mb-3">
                    <div className="border-2 rounded-full">
                      <ProfileAvatar
                        image={conversation.participants[0].image as string}
                        alt="profile"
                        width="8"
                        height="8"
                      />
                    </div>

                    <div className="absolute top-3 left-3 border-2 rounded-full">
                      <ProfileAvatar
                        image={conversation.participants[1].image as string}
                        alt="profile"
                        width="8"
                        height="8"
                      />
                    </div>
                  </div>

                  <div className="w-5/6 pl-3">
                    <h2 className="truncate">{conversation.name}</h2>
                    <p className="truncate text-xs w-full">
                      {conversation.lastMessage ? conversation.lastMessage : ""}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div>
              {conversation.participants.map((participant, idx) => (
                <div key={idx} className="max-w-full">
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
          )}
        </div>
      ))}
    </div>
  );
};

export default InboxPage;
