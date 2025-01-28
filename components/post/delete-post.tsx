"use client";

import { deletePost } from "@/lib/actions/post.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DeletePost = ({
  postId,
  username,
  userId,
}: {
  postId: string;
  username: string;
  userId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deletePostHandler = async (id: string) => {
    startTransition(() => {
      deletePost(id, userId)
        .then((data) => {
          if (data?.success) {
            toast.success(data?.success);
            router.push(`/${username}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg flex flex-col items-center justify-center py-2">
          Delete Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-between">
          <p>Are you sure you want to delete this post?</p>
          <div className="flex items-center space-x-2 mt-5">
            <Link href={`/p/${postId}`}>
              <Button variant={"secondary"} className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              variant={"destructive"}
              className="w-full"
              type="button"
              onClick={() => deletePostHandler(postId)}
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
        </div>
      </CardContent>
    </Card>
  );
};
export default DeletePost;
