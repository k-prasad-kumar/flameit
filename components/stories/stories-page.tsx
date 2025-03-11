"use client";

import { StoryLike, StoriesResponseInterface } from "@/types/types";
import {
  FlameIcon,
  HeartIcon,
  MoveLeftIcon,
  MoveRightIcon,
  PauseIcon,
  PlayIcon,
  SendIcon,
  TrashIcon,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { ProfileAvatar } from "../avatar";
import { Input } from "../ui/input";
import { getRelativeTime } from "@/lib/relative-time";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addStoryComment,
  deleteStory,
  updateStoryLike,
} from "@/lib/actions/stories.actions";
import { toast } from "sonner";
import StoryComments from "./story-comments";
import StoryLikes from "./story-likes";
import { Button } from "../ui/button";
import { Progress } from "@/components/ui/progress";
import StorySeenBy from "./story-seenby";

const StoriesPage = ({
  loginUserId,
  userId,
  stories,
  userStories,
}: {
  loginUserId: string;
  userId: string;
  stories: StoriesResponseInterface[];
  userStories: StoriesResponseInterface[];
}) => {
  const [storyIndex, setStoryIndex] = useState<number>(0); // Track the current story index
  const [story, setStory] = useState<StoriesResponseInterface | null>(
    userStories[0]
  );
  const [progress, setProgress] = useState<number>(0); // Track progress percentage
  const [text, setText] = useState<string>("");
  const [likePending, setLikePending] = useState<boolean>(false);
  const [commnetPending, setCommnetPending] = useState<boolean>(false);

  const [paused, setPaused] = useState<boolean>(false); // State to track pause
  const elapsedTimeRef = useRef(0); // Track elapsed time across re-renders
  const startTimeRef = useRef(Date.now()); // Track start time for the current story

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const uniqueUserIds = useMemo(() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    stories.forEach((story) => {
      const uid = String(story.user.id); // Ensure all IDs are strings
      if (!seen.has(uid)) {
        seen.add(uid);
        ids.push(uid);
      }
    });
    return ids;
  }, [stories]);

  // Ensure the unique user IDs list contains the current userId
  const currentIndex = uniqueUserIds.indexOf(userId);

  // Determine previous and next user IDs.
  const prevUserId = currentIndex > 0 ? uniqueUserIds[currentIndex - 1] : null;
  const nextUserId =
    currentIndex >= 0 && currentIndex < uniqueUserIds.length - 1
      ? uniqueUserIds[currentIndex + 1]
      : null;

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    let storyTimeout: NodeJS.Timeout | null = null;

    const totalDuration = 30000; // 30 seconds

    if (!paused) {
      // Calculate the remaining time when resuming
      const remainingTime = totalDuration - elapsedTimeRef.current;

      // Start the progress bar animation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval!);
            return 100;
          }
          const increment = (100 / totalDuration) * 30; // Increment based on 30ms updates
          return prev + increment;
        });
      }, 30);

      // Change story after remaining time
      storyTimeout = setTimeout(() => {
        if (storyIndex < userStories.length - 1) {
          setStoryIndex((prev) => prev + 1);

          setProgress(0); // Reset progress
          elapsedTimeRef.current = 0; // Reset elapsed time for the next story
        } else if (nextUserId) {
          router.push(`/stories/${nextUserId}`);
        } else if (!nextUserId) {
          router.push(`/`);
        }
      }, remainingTime);

      // Update the start time when resuming
      startTimeRef.current = Date.now();
    } else {
      // When paused, calculate the elapsed time
      elapsedTimeRef.current += Date.now() - startTimeRef.current;

      // Clear the interval and timeout when paused
      if (progressInterval) clearInterval(progressInterval);
      if (storyTimeout) clearTimeout(storyTimeout);
    }

    // Cleanup timers on unmount or pause/play toggle
    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (storyTimeout) clearTimeout(storyTimeout);
    };
  }, [paused, storyIndex, userStories, nextUserId, router]);

  // Update story when storyIndex changes
  useEffect(() => {
    if (userStories[storyIndex]) {
      setStory(userStories[storyIndex]);
    }
    setProgress(0); // Reset progress when the story changes
  }, [userStories, storyIndex]);

  // Pause/Resume handler
  const togglePause = () => {
    setPaused((prev) => !prev);
  };

  const handleNext = () => {
    if (storyIndex < userStories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setProgress(0); // Reset progress
      elapsedTimeRef.current = 0; // Reset elapsed time for the next story
    } else if (nextUserId) {
      router.push(`/stories/${nextUserId}`);
    } else if (!nextUserId) {
      router.push("/");
    }

    if (userStories[storyIndex]) {
      setStory(userStories[storyIndex]);
      setProgress(0);
    }
  };

  const handleLike = (id: string, storyUserId: string, type: string) => {
    setLikePending(true);
    startTransition(() => {
      updateStoryLike(id, storyUserId, userId, type).then((data) => {
        if (data?.success) {
          setLikePending(false);
          router.refresh();
        }
      });
    });
  };

  const handleComment = (id: string, storyUserId: string) => {
    if (!text) return toast.error("Type something");
    if (text.length > 100)
      return toast.error("Maximum text length is 100 characters");
    setCommnetPending(true);
    startTransition(() => {
      addStoryComment(id, storyUserId, userId, text).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          setText("");
          setCommnetPending(false);
          router.refresh();
        }
      });
    });
  };

  const handleDelete = (id: string, public_id: string) => {
    startTransition(() => {
      deleteStory(id, public_id).then((data) => {
        if (data?.success) {
          router.push("/");
        }
      });
    });
  };
  return (
    <div className="w-full h-screen relative z-50 bg-background">
      <div className="absolute top-0 left-0 w-full bg-background p-4 flex justify-between">
        <Link href="/" className="flex items-center space-x-1">
          <FlameIcon size={32} />
          <h1 className="text-2xl font-semibold mt-1">FlameIt.</h1>
        </Link>
        <Link href={"/"}>
          <X size={32} />
        </Link>
      </div>
      <div className="w-full h-full max-w-screen-sm mx-auto bg-background relative">
        {/* Navigation Arrows */}
        {prevUserId && (
          <Link
            href={`/stories/${prevUserId}`}
            className="absolute top-1/2 left-10 hidden md:flex"
          >
            <MoveLeftIcon />
          </Link>
        )}
        {nextUserId && (
          <Link
            href={`/stories/${nextUserId}`}
            className="absolute top-1/2 right-10 hidden md:flex"
          >
            <MoveRightIcon />
          </Link>
        )}
        <div className="w-full h-full sm:px-16 md:px-24">
          <div className="w-full h-full flex justify-center items-center">
            <div
              className={`w-screen h-screen relative p-0 ${
                story?.image
                  ? "bg-black"
                  : "bg-gradient-to-tl from-[#00ddff] to-[#ff00d4] text-white"
              } `}
            >
              <div
                className={`w-full flex absolute top-0 left-0 gap-1 z-50 px-1 md:px-[2px] mt-[2px] ${
                  story?.image ? "bg-black/60" : ""
                }`}
              >
                <div className="flex space-x-1 w-full">
                  {userStories.map((_, index) => {
                    if (index < storyIndex) {
                      // Completed stories
                      return (
                        <div
                          key={index}
                          className="w-full h-1 bg-blue-500 rounded-full"
                        />
                      );
                    } else if (index === storyIndex) {
                      // Current story with animated progress
                      return (
                        <Progress
                          key={index}
                          value={progress}
                          className="w-full h-1 transition-all rounded-full"
                        />
                      );
                    } else {
                      // Future stories
                      return (
                        <div
                          key={index}
                          className="w-full h-1 bg-white rounded-full"
                        />
                      );
                    }
                  })}
                </div>
              </div>

              <div
                className={`w-full absolute top-0 left-0 flex items-center justify-between gap-2 px-4 mt-2 py-1 mb-2 z-50  text-white ${
                  story?.image ? "bg-black/60" : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <Link href={"/"}>
                    <MoveLeftIcon strokeWidth={1.5} />
                  </Link>
                  <Link href={`/${story?.user.username}`}>
                    <ProfileAvatar
                      image={story?.user.image as string}
                      width="10"
                      height="10"
                      alt="profile"
                    />
                  </Link>

                  <div>
                    <Link href={`/${story?.user.username}`}>
                      <p>{story?.user.name}</p>
                    </Link>
                    <p className="text-[10px]">
                      {getRelativeTime(story?.createdAt as Date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div onClick={togglePause} className="cursor-pointer">
                    {paused ? (
                      <PlayIcon strokeWidth={1.5} />
                    ) : (
                      <PauseIcon strokeWidth={1.5} />
                    )}
                  </div>

                  {story?.userId === loginUserId && (
                    <div className="cursor-pointer flex items-center">
                      <Dialog>
                        <DialogTrigger>
                          <TrashIcon strokeWidth={1.5} />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center gap-5">
                            <DialogClose>
                              <p className="cursor-pointer rounded-md border h-full py-[6px] px-4 bg-gray-200 dark:bg-gray-600">
                                Cancel
                              </p>
                            </DialogClose>
                            <Button
                              variant={"destructive"}
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  story.id,
                                  story.image?.public_id as string
                                )
                              }
                              disabled={isPending}
                            >
                              {isPending ? (
                                <span
                                  className={`justify-center items-center ${
                                    isPending ? "flex" : "hidden"
                                  }`}
                                >
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                                </span>
                              ) : (
                                <span>Delete</span>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="w-full h-[calc(100vh-130px)] flex items-center justify-center mt-16 mb-14"
                onClick={() => handleNext()}
              >
                {story?.image ? (
                  <div className="w-full h-[calc(100vh-130px)] flex items-center justify-center mt-14 mb-14 relative">
                    <Image
                      src={story?.image?.url as string}
                      width={100}
                      height={100}
                      sizes="100%"
                      loading="lazy"
                      className="w-full h-auto object-cover"
                      alt="post"
                    />
                    {story?.text && (
                      <div className="absolute bottom-0 left-0 w-full h-fit bg-black/40 text-white px-4 py-2 text-center">
                        <p className="text-sm break-words">{story?.text}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center px-5">
                    {" "}
                    <p className="text-white text-xl">{story?.text}</p>
                  </div>
                )}
              </div>
              {story?.userId === loginUserId ? (
                <div
                  className={`w-full absolute bottom-0 flex items-center justify-center px-4 py-3 gap-14 ${
                    story?.image ? "bg-black/60 text-white" : "text-white"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <StorySeenBy seenBy={story.seenBy} />
                  </div>
                  <div className="flex items-center gap-1">
                    <StoryLikes likes={story.likes} />
                  </div>
                  <div className="flex items-center gap-1">
                    <StoryComments comments={story.comments} />
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full absolute bottom-0 flex items-center justify-between px-4 py-3 gap-4 ${
                    story?.image ? "bg-black/60 text-white" : "text-white"
                  }`}
                >
                  <Input
                    className="placeholder:text-white placeholder:text-sm"
                    placeholder={`Reply to ${story?.user.username} ...`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    onClick={() =>
                      handleComment(
                        story?.id as string,
                        story?.userId as string
                      )
                    }
                    disabled={commnetPending}
                  >
                    {commnetPending ? (
                      <span
                        className={`justify-center items-center ${
                          commnetPending ? "flex" : "hidden"
                        }`}
                      >
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                      </span>
                    ) : (
                      <span>
                        <SendIcon strokeWidth={1.5} color="white" />
                      </span>
                    )}
                  </button>
                  <div>
                    <button
                      onClick={() =>
                        handleLike(
                          story?.id as string,
                          story?.userId as string,
                          story?.likes.some(
                            (like: StoryLike) => like.userId === userId
                          )
                            ? "remove"
                            : "add"
                        )
                      }
                      className="px-0 w-10 h-10 flex items-center justify-center"
                      disabled={likePending}
                    >
                      {likePending ? (
                        <span
                          className={`justify-center items-center ${
                            likePending ? "flex" : "hidden"
                          }`}
                        >
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                        </span>
                      ) : (
                        <span>
                          <HeartIcon
                            color="white"
                            size={28}
                            fill={
                              story?.likes.some(
                                (like: StoryLike) => like.userId === userId
                              )
                                ? "red"
                                : "none"
                            }
                            strokeWidth={
                              story?.likes.some(
                                (like: StoryLike) => like.userId === userId
                              )
                                ? 0
                                : 1.5
                            }
                          />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoriesPage;
