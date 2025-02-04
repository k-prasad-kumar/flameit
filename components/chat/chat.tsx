/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ProfileAvatar } from "@/components/avatar";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  MessageCircleCodeIcon,
  Phone,
  SendIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationInterface, MessageInterface } from "@/types/types";
import { useEffect, useRef, useState, useTransition } from "react";
import { getMessages, sendMessage } from "@/lib/actions/realtime.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSocket } from "@/context/use.socket";
import { formatDate } from "@/lib/format-date";

const ChatPage = ({
  conversation,
  userId,
}: {
  conversation: ConversationInterface;
  userId: string;
}) => {
  const [text, setText] = useState<string>("");
  const [reciveMessage, setReciveMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageInterface[]>();
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false); // Prevent multiple requests
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const prevScrollTopRef = useRef<number | null>(null);

  const socket = useSocket();
  const router = useRouter();

  const scrollToBottom = (forceScroll = false) => {
    if (!messagesEndRef.current || !chatContainerRef.current) return;

    const chatContainer = chatContainerRef.current;
    const isAtBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <=
      chatContainer.clientHeight + 50; // Check if user is at the bottom

    if (forceScroll || isAtBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { messages, nextCursor } = await getMessages(
        conversation?.id,
        "",
        40
      );

      setMessages(messages.reverse());
      setNextCursor(nextCursor);
    };
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  useEffect(() => {
    if (messages && messages.length > 0 && messagesEndRef.current) {
      if (!hasScrolledInitially) {
        scrollToBottom(true);
        setHasScrolledInitially(true);
      } // Set the flag after the initial scroll// ✅ Scroll only when messages are available
    }
  }, [messages]);

  useEffect(() => {
    if (socket && socket.connected) {
      socket.on("typing", () => {
        setTyping(true);
        scrollToBottom(true);
      });

      socket.on("stopTyping", () => {
        console.log("stoptyping.....");
        setTyping(false);
      });
      socket.on("newMessage", (message) => {
        setMessages((prev) => [
          ...(prev as MessageInterface[]),
          message?.newMessage as MessageInterface,
        ]);
        scrollToBottom(true);
        setReciveMessage(false); // Reset after some time or condition
      });
    } else {
      console.log("socket not connected");
    }
    // socket?.emit("messageRecived", conversation?.id);
    return () => {
      // Clean up the listener when the component is unmounted
      socket?.off("newMessage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciveMessage, typing]);

  const handleScroll = async () => {
    if (!chatContainerRef.current || isFetchingRef.current || !nextCursor)
      return;

    const chatContainer = chatContainerRef.current;
    const scrollTop = chatContainer.scrollTop;

    // Only fetch messages when scrolling up AND near the top
    if (
      prevScrollTopRef.current !== null && // Ensure previous scroll position exists
      prevScrollTopRef.current > scrollTop && // Check if scrolling upwards
      scrollTop < 100 // Check if near the top
    ) {
      isFetchingRef.current = true;

      setLoading(true);
      const {
        messages: oldMessages,
        nextCursor: newCursor,
      }: { messages: MessageInterface[]; nextCursor: string | null } =
        await getMessages(conversation?.id, nextCursor, 40);

      setMessages((prev) => [
        ...oldMessages.reverse(),
        ...(prev as MessageInterface[]),
      ]);
      setNextCursor(newCursor);
      isFetchingRef.current = false;
      setLoading(false);
    }

    prevScrollTopRef.current = scrollTop; // Update previous scroll position
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (socket && socket.connected) {
      const recieverIds: string[] = [];
      conversation?.participants?.filter((p) =>
        p?.userId !== userId ? recieverIds.push(p?.userId) : null
      );
      socket.emit("typing", recieverIds);
    } else {
      console.log("socket not connected");
    }

    setText(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) return toast.error("Type some message...");
    startTransition(() => {
      sendMessage(conversation?.id, userId, text).then((data) => {
        if (data?.success) {
          if (socket && socket.connected) {
            // emiting stop typing
            const recieverIds: string[] = [];
            conversation?.participants?.filter((p) =>
              p?.userId !== userId ? recieverIds.push(p?.userId) : null
            );
            socket.emit("stopTyping", recieverIds);

            // emiting new message
            socket.emit("newMessage", {
              ...data,
              conversationParticipants: conversation?.participants,
              senderId: userId,
            });
            setMessages((prev) => [
              ...(prev as MessageInterface[]),
              data?.newMessage as MessageInterface,
            ]);
            scrollToBottom();
            setReciveMessage(true);

            setText("");
            router.refresh();
          }
        }
      });
    });
  };

  // Group messages by date
  const groupedMessages = messages?.reduce((acc, message) => {
    const dateKey = formatDate(new Date(message.createdAt).toISOString()); // Ensure it's a string
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {} as Record<string, MessageInterface[]>);

  return (
    <div className="px-0 md:px-4 lg:px-10 pt-0 md:pt-6 flex flex-col items-between relative mx-1 md:mx-0 border-x-0 md:border-x">
      {/* {conversation } */}
      <div className="w-full max-w-screen-sm mx-auto flex items-center justify-between gap-2 mb-12 md:mb-0 fixed top-14 left-0 right-0 p-2 bg-background px-3 md:px-4 lg:px-10 z-10 border-0 md:border">
        <div className="flex items-center space-x-3">
          <Link href={"/inbox"}>
            <ArrowLeft size={24} strokeWidth={1} />
          </Link>

          {conversation?.isGroup ? (
            <div></div>
          ) : (
            <Link
              href={`/${
                conversation?.participants[0]?.userId !== userId
                  ? conversation?.participants[0]?.username
                  : conversation?.participants[1]?.username
              }`}
              className="flex items-center space-x-3"
            >
              <ProfileAvatar
                image={
                  conversation?.participants[0]?.userId !== userId
                    ? (conversation?.participants[0]?.image as string)
                    : (conversation?.participants[1]?.image as string)
                }
                alt="profile"
                width="12"
                height="12"
              />
              <div className="flex flex-col">
                <p className="text-lg flex items-center">
                  {conversation?.participants[0]?.userId !== userId
                    ? conversation?.participants[0]?.username
                    : conversation?.participants[1]?.username}{" "}
                  <ChevronRight size={16} strokeWidth={1} />
                </p>
              </div>
            </Link>
          )}
        </div>
        <Phone size={24} strokeWidth={1} className="mr-3" />
      </div>
      {messages?.length === 0 && (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="mb-4">
            <MessageCircleCodeIcon size={54} strokeWidth={1} />
          </div>
          <h1 className="text-xl">Your messages</h1>
          <p className="text-sm">Send a message to start a chat.</p>
        </div>
      )}
      {messages && messages?.length > 0 && (
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="w-full h-[72vh] max-h-[72vh] md:h-[77vh] md:max-h-[77vh] overflow-y-scroll py-2 mt-[45px] mb-[55px]"
        >
          <div className="mb-4">
            {loading && (
              <div className="w-full flex justify-center items-center mt-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            )}
            {Object.entries(groupedMessages || {}).map(
              ([date, messagesForDate]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="w-full text-center text-sm text-gray-500 py-2">
                    {date} {/* "Today", "Yesterday", or "Jan 31, 2025" */}
                  </div>

                  {/* Messages for this Date */}
                  {messagesForDate.map((message) => (
                    <div
                      key={message.id}
                      className="space-y-2 py-2 w-full h-full flex gap-2 flex-col"
                    >
                      {message.senderId !== userId ? (
                        <div className="flex space-x-2 w-3/4 ml-2">
                          <Link href={`/${message.sender?.username}`}>
                            <ProfileAvatar
                              image={message.sender?.image as string}
                              alt="profile"
                              width="6"
                              height="6"
                            />
                          </Link>
                          <div className="max-w-3/4">
                            <p className="text-sm px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 max-w-3/4">
                              {message.text}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-x-2 w-full max-w-3/4 grid justify-items-stretch">
                          <p className="text-sm px-5 py-2 rounded-xl text-white bg-[#3797f0] w-fit max-w-3/4 justify-self-end mr-3">
                            {message.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {typing && (
              <div className="flex ml-5 mt-4 opacity-70 font-semibold px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 w-fit">
                <span className="">typing</span>
                <span className="animate-bounce font-bold">.</span>
                <span className="animate-bounce font-bold">.</span>
                <span className="animate-bounce font-bold">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-screen-sm mx-auto flex items-center gap-2 mb-12 md:mb-0 fixed bottom-0 left-0 right-0 p-2 bg-background px-3 md:px-4 lg:px-10 border-0 md:border">
          <Input
            type="text"
            placeholder="Type a message..."
            onChange={handleOnChange}
            value={text}
          />
          <Button variant={"blue"} type="submit" disabled={isPending}>
            {isPending ? (
              <span
                className={`justify-center items-center ${
                  isPending ? "flex" : "hidden"
                }`}
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
              </span>
            ) : (
              <span>
                <SendIcon size={24} strokeWidth={1} />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChatPage;
