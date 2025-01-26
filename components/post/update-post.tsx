"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PencilIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProfileAvatar } from "../avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import { updatePost } from "@/lib/actions/post.actions";
import { toast } from "sonner";

const UpdatePost = ({
  username,
  image,
  postId,
  postImage,
  caption,
}: {
  username: string;
  image: string;
  postId: string;
  postImage: string;
  caption: string;
}) => {
  const [text, setText] = useState<string>(caption);
  const [open, setOpen] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(() => {
      updatePost(postId, text).then((data) => {
        if (data?.success) {
          setOpen(false);
          toast.success("Post updated successfully");
          router.refresh();
        }
      });
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <p className="flex items-center gap-3">
            <PencilIcon size={18} strokeWidth={1.5} />
            <span>Edit</span>
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center w-full">
            Edit Post
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-[75vh] max-h-[75vh] md:h-[80vh] md:max-h-[80vh]">
          <div className="flex space-x-3 font-semibold items-center">
            <ProfileAvatar
              image={image ? image : "https://github.com/shadcn.png"}
              alt="profile"
              width="10"
              height="10"
            />
            <div className="flex flex-col w-full">
              <h2>{username}</h2>
            </div>
          </div>
          <div className="flex aspect-square items-center justify-center mt-1">
            <Image
              src={`${postImage}`}
              width={100}
              height={100}
              sizes="100%"
              loading="lazy"
              className="w-auto h-[450px] object-cover"
              alt="post"
            />
          </div>
          <textarea
            rows={8}
            placeholder="What's on your mind?"
            className="border-none outline-none text-sm bg-transparent w-full mt-1"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </ScrollArea>
        <Button onClick={handleSubmit}>
          {isPending ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Save"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default UpdatePost;
