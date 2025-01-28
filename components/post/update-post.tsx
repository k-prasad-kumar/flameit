"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProfileAvatar } from "../avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import { updatePost } from "@/lib/actions/post.actions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(() => {
      updatePost(postId, text).then((data) => {
        if (data?.success) {
          toast.success("Post updated successfully");
          router.push(`/p/${postId}`);
        }
      });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Update Post</CardTitle>
      </CardHeader>

      <CardContent>
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
        <div className="flex justify-end w-full">
          <Button onClick={handleSubmit}>
            {isPending ? (
              <span
                className={`justify-center items-center ${
                  isPending ? "flex" : "hidden"
                }`}
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
              </span>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default UpdatePost;
