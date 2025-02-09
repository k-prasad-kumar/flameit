"use client";

import { ProfileAvatar } from "@/components/avatar";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ImageIcon,
  MessageCircleCodeIcon,
  Phone,
  SendIcon,
  TrashIcon,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  ConversationInterface,
  MessageInterface,
  Reactions,
} from "@/types/types";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  deleteMessage,
  getMessages,
  sendMessage,
  updateConversation,
  updateReaction,
} from "@/lib/actions/realtime.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSocket } from "@/context/use.socket";
import { formatDate } from "@/lib/format-date";
import Image from "next/image";

import ActionButtons from "./action-buttons";
import MessageReactions from "./reactions";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "../ui/button";
import { deleteImageCloudinary } from "@/lib/actions/delete.image.actions";

const ChatPage = ({
  conversation,
  userId,
  name,
  image,
}: {
  conversation: ConversationInterface;
  userId: string;
  name: string;
  image: string;
}) => {
  const [text, setText] = useState<string | null>(null);
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
  const [replyTo, setReplyTo] = useState<{
    id: string;
    text: string;
    username: string;
    userId: string;
  } | null>(null); // Reply state
  const [uploadImage, setUploadImage] = useState<{
    url: string;
    public_id: string;
  } | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // New effect to mark all messages in the conversation as seen by the logged-in user.
  useEffect(() => {
    // Only run if conversation exists and userId is available.
    if (conversation?.id && userId) {
      // Create an async function to call the API.
      const markMessagesAsSeen = async () => {
        try {
          await updateConversation(conversation?.id, userId);
          router.refresh();
          // Optionally, update your local messages state or refetch messages.
        } catch (error) {
          console.error("Failed to mark messages as seen:", error);
        }
      };
      markMessagesAsSeen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id, userId]);

  // updating reactions real-time
  useEffect(() => {
    if (socket && socket.connected) {
      const handleReactionUpdated = (data: {
        messageId: string;
        updatedReactions: Reactions[];
      }) => {
        setMessages((prevMessages) =>
          prevMessages?.map((msg) => {
            if (msg.id === data.messageId) {
              return { ...msg, reactions: data.updatedReactions };
            }
            return msg;
          })
        );
      };

      socket.on("reactionUpdated", handleReactionUpdated);

      return () => {
        socket.off("reactionUpdated", handleReactionUpdated);
      };
    }
  }, [socket]);

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
    if (e) e.preventDefault();

    if (!text && !uploadImage) return toast.error("Type some message...");
    startTransition(() => {
      sendMessage(
        conversation?.id,
        userId,
        text ? text : null,
        replyTo?.id,
        uploadImage
          ? {
              image: uploadImage?.url ? (uploadImage?.url as string) : null,
              imagePublicId: uploadImage?.public_id
                ? (uploadImage?.public_id as string)
                : null,
            }
          : null
      ).then((data) => {
        if (data?.success) {
          if (socket && socket.connected) {
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
            setUploadImage(null);
            setReplyTo(null);
            scrollToBottom();
            setReciveMessage(true);

            setText(null);
            router.refresh();
          }
        }
      });
    });
  };

  const removeImage = (id: string) => {
    deleteImageCloudinary(id);
    setUploadImage(null);
  };

  const handleReact = (id: string, emoji: string) => {
    startTransition(() => {
      updateReaction(id, userId, name, image, emoji).then((data) => {
        if (data?.success) {
          if (socket && socket.connected) {
            socket.emit("reactionUpdated", {
              messageId: id,
              updatedReactions: data.updatedReactions, // always an array
              conversationParticipants: conversation?.participants,
              senderId: userId,
            });
          }
          // Update local state immediately for this message:
          setMessages((prevMessages) =>
            prevMessages?.map((msg) => {
              if (msg.id === id) {
                return { ...msg, reactions: data.updatedReactions };
              }
              return msg;
            })
          );
        }
      });
    });
  };

  const handleUnsend = (id: string) => {
    setMessages(messages?.filter((msg) => msg.id !== id));

    startTransition(() => {
      deleteMessage(id).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          router.refresh();
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
            <div className="flex items-center space-x-3">
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
              <div className="flex flex-col pl-3">
                <p className="flex items-center">
                  {conversation.name}
                  <ChevronRight size={16} strokeWidth={1} />
                </p>
              </div>
            </div>
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
                width="10"
                height="10"
              />
              <div className="flex flex-col">
                <p className="flex items-center">
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
          className="w-full h-[72vh] max-h-[72vh] md:h-[77vh] md:max-h-[77vh] overflow-y-scroll py-2 mt-10"
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
                      className="py-2 w-full flex flex-col overflow-hidden"
                    >
                      {/* Replied message */}
                      {message?.parentMessage && (
                        <div
                          className={`flex flex-col w-full mb-1 pl-12 pr-2 ${
                            message?.senderId !== userId
                              ? "justify-start items-start"
                              : "justify-end items-end"
                          }`}
                        >
                          {message.senderId !== userId && (
                            <p className="text-xs opacity-70 mb-1">
                              {message?.sender?.username} replied to{" "}
                              {userId === message?.parentMessage?.senderId
                                ? "you"
                                : message.senderId ===
                                  message.parentMessage.senderId
                                ? "himself"
                                : message?.parentMessage?.sender?.username}
                            </p>
                          )}
                          {message.senderId === userId && (
                            <p className="text-xs opacity-70 mb-1">
                              you replied to{" "}
                              {userId === message?.parentMessage?.senderId
                                ? "yourself"
                                : message?.parentMessage?.sender?.username}
                            </p>
                          )}
                          {message?.parentMessage?.post ? (
                            <Link
                              href={`#${message?.parentMessage?.id}`}
                              className="w-1/5 flex gap-2"
                            >
                              <Image
                                src={
                                  message?.parentMessage?.post?.image as string
                                }
                                alt="post"
                                width={100}
                                height={100}
                                sizes="100%"
                                className="w-full h-auto object-cover opacity-90 rounded-3xl"
                              />
                            </Link>
                          ) : (
                            <div className={`flex w-4/5`}>
                              <div
                                className={`flex items-center gap-2 w-full ${
                                  message?.senderId !== userId
                                    ? "justify-start items-start"
                                    : "justify-end items-end"
                                }`}
                              >
                                {message?.senderId !== userId && (
                                  <div className="w-1 h-full max-h-full rounded-full bg-gray-300"></div>
                                )}
                                <Link
                                  href={`#${message?.parentMessage?.id}`}
                                  className="flex text-sm px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 text-black dark:text-white"
                                >
                                  {message?.parentMessage?.text}
                                </Link>

                                {message?.senderId === userId && (
                                  <div className="w-1 h-full max-h-full rounded-full bg-gray-300"></div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message without Post */}
                      {!message?.post && (
                        <div
                          className={`flex w-full items-start ${
                            message.senderId !== userId
                              ? "justify-start pl-4"
                              : "justify-end pr-2"
                          }`}
                        >
                          {message.senderId !== userId && (
                            <Link
                              href={`/${message.sender?.username}`}
                              className="mr-2"
                            >
                              <ProfileAvatar
                                image={message.sender?.image as string}
                                alt="profile"
                                width="6"
                                height="6"
                              />
                            </Link>
                          )}

                          {message.senderId === userId && (
                            <div className={`w-4/6 flex flex-col items-end`}>
                              <div className={`w-full flex group justify-end`}>
                                <div
                                  className={`hidden group-hover:flex items-center min-w-fit max-w-1/5 relative`}
                                >
                                  <ActionButtons
                                    messageId={message.id}
                                    messageText={message.text as string}
                                    messageSenderId={message.senderId}
                                    messageUsername={message.sender?.username}
                                    handleUnsend={handleUnsend}
                                    handleReact={handleReact}
                                    setReplyTo={setReplyTo}
                                    isPending={isPending}
                                    isUnsended={true}
                                  />
                                </div>
                                <div className="min-w-fit max-w-4/5">
                                  <div
                                    className={`text-sm px-4 py-2 rounded-xl w-fit max-w-4/5 ${
                                      message.senderId !== userId
                                        ? "bg-gray-100 dark:bg-gray-600 text-black dark:text-white"
                                        : "bg-[#3797f0] text-white"
                                    } relative`}
                                    id={`${message.id}`}
                                  >
                                    {message.text}
                                  </div>
                                </div>
                              </div>
                              {message.reactions?.length > 0 && (
                                <div className="bg-gray-100 dark:bg-gray-600 px-1 w-fit rounded-full text-sm">
                                  <MessageReactions
                                    reactions={message?.reactions}
                                    messageId={message.id}
                                    userId={userId}
                                    handleReact={handleReact}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          {message.senderId !== userId && (
                            <div
                              className={`w-4/6 flex flex-col justify-start`}
                            >
                              <div className={`w-full flex group`}>
                                <div className="min-w-fit max-w-4/5">
                                  <div
                                    className={`text-sm px-4 py-2 rounded-xl w-fit max-w-4/5 border-black ${
                                      message.senderId !== userId
                                        ? "bg-gray-100 dark:bg-gray-600 text-black dark:text-white"
                                        : "bg-[#3797f0] text-white"
                                    } relative`}
                                    id={`${message.id}`}
                                  >
                                    {message.text}
                                  </div>
                                </div>

                                <div
                                  className={`hidden group-hover:flex items-center min-w-fit max-w-1/5`}
                                >
                                  <ActionButtons
                                    messageId={message.id}
                                    messageText={message.text as string}
                                    messageSenderId={message.senderId}
                                    messageUsername={message.sender?.username}
                                    handleUnsend={handleUnsend}
                                    handleReact={handleReact}
                                    setReplyTo={setReplyTo}
                                    isPending={isPending}
                                    isUnsended={false}
                                  />
                                </div>
                              </div>
                              {message.reactions?.length > 0 && (
                                <div className="bg-gray-100 dark:bg-gray-600 px-1 w-fit rounded-full text-sm">
                                  <MessageReactions
                                    reactions={message?.reactions}
                                    messageId={message.id}
                                    userId={userId}
                                    handleReact={handleReact}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message with Post (Receiver Side) */}
                      {message?.post && message.senderId !== userId && (
                        <div className="w-full flex group pl-4">
                          <div className="w-1/2">
                            <div
                              className="relative bg-black rounded-xl overflow-hidden"
                              id={`${message.id}`}
                            >
                              {/* Post User Info (Top Left) */}
                              {!message?.post?.imagePublicId && (
                                <Link
                                  href={`/${message?.post?.username}`}
                                  className="absolute top-2 left-2 flex items-center gap-2 z-10"
                                >
                                  <ProfileAvatar
                                    image={message.post?.image as string}
                                    alt="profile"
                                    width="6"
                                    height="6"
                                  />
                                  <p className="text-white text-sm">
                                    {message?.post?.username}
                                  </p>
                                </Link>
                              )}

                              {/* Post Image (Dimmed) */}
                              <Link
                                href={
                                  !message?.post?.imagePublicId
                                    ? `/p/${message?.post?.postId}`
                                    : "#"
                                }
                              >
                                <Image
                                  src={message?.post?.image as string}
                                  alt="post"
                                  width={100}
                                  height={100}
                                  sizes="100%"
                                  className="w-full h-auto object-cover opacity-90"
                                />
                              </Link>

                              {/* Message Text Below Post */}
                              <p className="text-sm px-5 py-2 text-white bg-black bg-opacity-60 rounded-b-xl">
                                {message.text}
                              </p>
                            </div>
                            {message.reactions?.length > 0 && (
                              <div className="bg-gray-100 dark:bg-gray-600 px-1 w-fit rounded-full text-sm">
                                <MessageReactions
                                  reactions={message?.reactions}
                                  messageId={message.id}
                                  userId={userId}
                                  handleReact={handleReact}
                                />
                              </div>
                            )}
                          </div>

                          <div
                            className={`hidden group-hover:flex flex-col min-h-full items-center justify-center`}
                          >
                            <ActionButtons
                              messageId={message.id}
                              messageText={message.text as string}
                              messageSenderId={message.senderId}
                              messageUsername={message.sender?.username}
                              handleUnsend={handleUnsend}
                              handleReact={handleReact}
                              setReplyTo={setReplyTo}
                              isPending={isPending}
                              isUnsended={false}
                            />
                          </div>
                        </div>
                      )}

                      {/* Message with Post (Sender Side - Right Side) */}
                      {message?.post && message.senderId === userId && (
                        <div className="w-full flex justify-end group pr-2">
                          <div
                            className={`hidden group-hover:flex flex-col min-h-full items-center justify-center`}
                          >
                            <ActionButtons
                              messageId={message.id}
                              messageText={message.text as string}
                              messageSenderId={message.senderId}
                              messageUsername={message.sender?.username}
                              handleUnsend={handleUnsend}
                              handleReact={handleReact}
                              setReplyTo={setReplyTo}
                              isPending={isPending}
                              isUnsended={true}
                            />
                          </div>
                          <div className="w-1/2">
                            <div
                              className="relative bg-black rounded-xl overflow-hidden"
                              id={`${message.id}`}
                            >
                              {/* Post User Info (Top Left) */}
                              {!message?.post?.imagePublicId && (
                                <Link
                                  href={`/${message.post?.username}`}
                                  className="absolute top-2 left-2 flex items-center gap-2 z-10 bg-inherit rounded-full px-2 py-1"
                                >
                                  <ProfileAvatar
                                    image={message.post?.image as string}
                                    alt="profile"
                                    width="6"
                                    height="6"
                                  />
                                  <p className="text-white text-sm truncate">
                                    {message?.post?.username as string}
                                  </p>
                                </Link>
                              )}

                              {/* Post Image (Dimmed) */}
                              <Link
                                href={
                                  !message?.post?.imagePublicId
                                    ? `/p/${message?.post?.postId}`
                                    : "#"
                                }
                              >
                                <Image
                                  src={message?.post?.image as string}
                                  alt="post"
                                  width={100}
                                  height={100}
                                  sizes="100%"
                                  className="w-full h-auto object-cover opacity-90"
                                />
                              </Link>

                              {/* Message Text Below Post */}
                              <p className="text-sm px-5 py-2 text-white bg-black bg-opacity-60 rounded-b-xl">
                                {message.text}
                              </p>
                            </div>
                            <div className="w-full flex justify-end">
                              {message.reactions?.length > 0 && (
                                <div className="bg-gray-100 dark:bg-gray-600 px-1 w-fit rounded-full text-sm">
                                  <MessageReactions
                                    reactions={message?.reactions}
                                    messageId={message.id}
                                    userId={userId}
                                    handleReact={handleReact}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
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
        <div className="w-full max-w-screen-sm mx-auto flex flex-col mb-12 md:mb-0 fixed bottom-0 left-0 right-0 p-2 bg-background px-3 md:px-4 lg:px-10 border-0 md:border">
          {replyTo && (
            <div>
              <div className="flex justify-between">
                <span className="text-sm">
                  Replying to{" "}
                  {replyTo?.userId === userId ? "yourself" : replyTo?.username}
                </span>
                <X
                  onClick={() => setReplyTo(null)}
                  className="cursor-pointer"
                />
              </div>
              <div>
                {replyTo?.text && (
                  <div className="flex items-center gap-2 w-full mb-4">
                    <p className="text-xs opacity-75 truncate w-full mr-5">
                      {replyTo?.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {uploadImage && (
            <div className="flex items-center gap-2 w-full justify-center">
              <div className="relative mb-2 h-[200px]">
                <Image
                  src={uploadImage?.url}
                  alt="post"
                  width={100}
                  height={100}
                  sizes="100%"
                  className="w-auto h-full object-cover"
                />
                <div className="absolute top-0 right-0 z-10">
                  <Button
                    type="button"
                    onClick={() => removeImage(uploadImage?.public_id)}
                    size="sm"
                    className="bg-red-500 p-2"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Message..."
              onChange={handleOnChange}
              value={text ? text : ""}
            />

            <div className={`p-1 ${uploadImage ? "hidden" : "block"}`}>
              <CldUploadWidget
                uploadPreset="flameit-messages"
                options={{ multiple: false, maxFiles: 1 }}
                onSuccess={(result) => {
                  setUploadImage({
                    url: (result.info as CloudinaryUploadWidgetInfo).secure_url,
                    public_id: (result.info as CloudinaryUploadWidgetInfo)
                      .public_id,
                  });
                }}
              >
                {({ open }) => {
                  return (
                    <div className="cursor-pointer" onClick={() => open()}>
                      <ImageIcon size={24} strokeWidth={1.5} />
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
            <button type="submit" disabled={isPending} className="px-1 py-1">
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
                  <SendIcon size={24} strokeWidth={1.5} />
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ChatPage;
