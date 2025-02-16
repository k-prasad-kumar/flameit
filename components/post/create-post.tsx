"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, TrashIcon } from "lucide-react";
import { ProfileAvatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { deleteImageCloudinary } from "@/lib/actions/delete.image.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/post.actions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useSocket } from "@/context/use.socket";
import { getFollowersForInbox } from "@/lib/actions/user.actions";
import { FollowerInterface } from "@/types/types";

const CreatePost = ({
  userId,
  username,
  image,
}: {
  userId: string;
  username: string;
  image: string;
}) => {
  const [caption, setCaption] = useState<string>("");
  const [images, setImages] = useState<{ url: string; public_id: string }[]>(
    []
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const socket = useSocket();

  const removeImage = (idx: number) => {
    deleteImageCloudinary(images[idx].public_id);

    const res = images?.filter((_, i) => i != idx);
    setImages(res);
  };

  const sendNotifications = async () => {
    if (!socket) return;

    const followers: FollowerInterface[] = await getFollowersForInbox(userId);
    const recivers = followers?.filter((follower) => follower.id);

    if (socket && socket.connected) {
      socket.emit("notification", {
        recivers: recivers,
        text: `${username} shared a post.`,
      });
    } else {
      console.log("socket not connected");
    }
  };

  const handleSubmit = () => {
    if (images.length === 0) return toast.error("Please upload a photo");
    startTransition(() => {
      createPost({ userId, images, caption }).then(async (data) => {
        if (data?.success) {
          await sendNotifications();
          setImages([]);
          setCaption("");
          router.push(`/`);
          toast.success("Post created successfully");
        }
      });
    });
  };

  return (
    <Card className="w-full max-h-full mb-5 mx-3">
      <CardContent className="max-h-screen max-w-screen-sm">
        <CardHeader className="w-full justify-center">
          <CardTitle className="text-center">Create new post</CardTitle>
        </CardHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="flex space-x-4">
            <ProfileAvatar
              image={image ? image : "https://github.com/shadcn.png"}
              alt="profile"
              width="10"
              height="10"
            />
            <div className="flex flex-col w-full">
              <h2>{username}</h2>
              <textarea
                rows={14}
                placeholder="What's on your mind?"
                className="border-none outline-none text-sm bg-transparent scroll"
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
              />
            </div>
          </div>
          <div className="gap-2 flex flex-wrap">
            {images?.map((image, idx) => (
              <div
                key={image.public_id}
                className="relative w-[100px] h-[140px] flex"
              >
                <div className="absolute top-0 right-0 z-10">
                  <Button
                    type="button"
                    onClick={() => removeImage(idx)}
                    size="sm"
                    className="bg-red-500 p-2"
                    disabled={isPending}
                  >
                    <TrashIcon />
                  </Button>
                </div>
                <Image
                  src={image.url}
                  alt="posts"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-between items-center mt-2">
          <CldUploadButton
            uploadPreset="flameit-images"
            options={{ maxFiles: 5 }}
            onSuccess={(result) => {
              setImages((prev) => [
                ...prev,
                {
                  url: (result.info as CloudinaryUploadWidgetInfo).secure_url,
                  public_id: (result.info as CloudinaryUploadWidgetInfo)
                    .public_id,
                },
              ]);
            }}
            className="px-4 py-2 flex items-center space-x-2 text-[#777777] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
          >
            <ImageIcon size={18} />
            <p>
              Photo <span className="text-xs">(Max 5 photos)</span>
            </p>
          </CldUploadButton>
          <Button type="submit" onClick={handleSubmit}>
            {isPending ? (
              <span
                className={`justify-center items-center ${
                  isPending ? "flex" : "hidden"
                }`}
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
              </span>
            ) : (
              <span>Post</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default CreatePost;
