"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { StoryLike, StroriesResponseInterface } from "@/types/types";
import {
  FlameIcon,
  HeartIcon,
  MoveLeftIcon,
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
import { useState, useTransition } from "react";
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

const StoriesPage = ({
  userId,
  stories,
}: {
  userId: string;
  stories: StroriesResponseInterface[];
}) => {
  const [text, setText] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLike = (id: string, type: string) => {
    startTransition(() => {
      updateStoryLike(id, userId, type).then((data) => {
        if (data?.success) {
          router.refresh();
        }
      });
    });
  };
  const handleComment = (id: string) => {
    if (!text) return toast.error("Type something");
    if (text.length > 100)
      return toast.error("Maximum text length is 100 characters");

    startTransition(() => {
      addStoryComment(id, userId, text).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          setText("");
          router.refresh();
        }
      });
    });
  };

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteStory(id).then((data) => {
        if (data?.success) {
          router.push("/");
        }
      });
    });
  };
  return (
    <div className="w-full h-screen relative z-50 bg-background">
      <div className="absolute top-0 left-0 w-full bg-background p-4 flex justify-between border-2 border-red-500">
        <Link href="/" className="flex items-center space-x-1">
          <FlameIcon size={32} />
          <h1 className="text-2xl font-semibold mt-1">FlameIt.</h1>
        </Link>
        <Link href={"/"}>
          <X size={32} />
        </Link>
      </div>
      <div className="w-full h-full max-w-screen-sm absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 mx-auto bg-background">
        <div className="w-full h-full sm:px-16 md:px-24">
          <div className="w-full h-full flex justify-center items-center">
            <Carousel className="w-full h-full flex justify-center">
              <CarouselContent className="w-full h-full ml-[0px]">
                {stories?.map((story) => (
                  <CarouselItem
                    className={`w-screen h-screen relative p-0 ${
                      story.text
                        ? "bg-gradient-to-tl  from-[#00ddff] to-[#ff00d4]"
                        : "bg-background"
                    }`}
                    key={story.id}
                  >
                    <div className="w-full absolute top-0 left-0 flex items-center justify-between gap-2 text-white rounded-full mx-4 my-2">
                      <div className="flex gap-3 items-center">
                        <Link href={"/"}>
                          <MoveLeftIcon strokeWidth={1.5} />
                        </Link>
                        <ProfileAvatar
                          image={story.user.image as string}
                          width="10"
                          height="10"
                          alt="profile"
                        />
                        <div>
                          <p>{story.user.name}</p>
                          <p className="text-[10px]">
                            {getRelativeTime(story.createdAt)}
                          </p>
                        </div>
                      </div>
                      {story.userId === userId && (
                        <div className="mr-8 cursor-pointer">
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
                                  <Button variant={"secondary"}>Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant={"destructive"}
                                  type="button"
                                  onClick={() => handleDelete(story.id)}
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
                    {story.image ? (
                      <div className="w-full h-[calc(100vh-130px)] flex items-center justify-center mt-14 mb-14">
                        <Image
                          src={story.image?.url as string}
                          width={100}
                          height={100}
                          sizes="100%"
                          loading="lazy"
                          className="w-auto h-full object-cover"
                          alt="post"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center px-5">
                        {" "}
                        <p className="text-white text-xl">{story.text}</p>
                      </div>
                    )}
                    {story.userId === userId ? (
                      <div className="w-full absolute bottom-0 flex items-center justify-center text-white px-4 mb-4 gap-14">
                        <div className="flex items-center gap-1">
                          <StoryLikes likes={story.likes} />
                        </div>
                        <div className="flex items-center gap-1">
                          <StoryComments comments={story.comments} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full absolute bottom-0 flex items-center justify-between px-4 mb-4 gap-4 text-white">
                        <Input
                          className="placeholder:text-white"
                          placeholder={`Reply to ${story.user.username} ...`}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                        <button onClick={() => handleComment(story.id)}>
                          <SendIcon strokeWidth={1.5} color="white" />
                        </button>
                        <div>
                          <button
                            onClick={() =>
                              handleLike(
                                story.id,
                                story.likes.some(
                                  (like: StoryLike) => like.userId === userId
                                )
                                  ? "remove"
                                  : "add"
                              )
                            }
                            className="px-0 w-10 h-10 flex items-center justify-center"
                            disabled={isPending}
                          >
                            <HeartIcon
                              color="white"
                              size={28}
                              fill={
                                story.likes.some(
                                  (like: StoryLike) => like.userId === userId
                                )
                                  ? "red"
                                  : "none"
                              }
                              strokeWidth={
                                story.likes.some(
                                  (like: StoryLike) => like.userId === userId
                                )
                                  ? 0
                                  : 1.5
                              }
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoriesPage;
