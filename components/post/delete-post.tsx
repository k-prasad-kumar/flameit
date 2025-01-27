"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { deletePost } from "@/lib/actions/post.actions";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";
import { Separator } from "../ui/separator";

const DeletePost = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deletePostHandler = async (id: string) => {
    startTransition(() => {
      deletePost(id)
        .then((data) => {
          if (data?.success) {
            router.refresh();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer">
          {" "}
          <div className="cursor-pointer">
            <p className="flex items-center gap-3 text-red-500">
              <TrashIcon size={18} strokeWidth={1.5} />
              <span>Delete</span>
            </p>
          </div>
        </span>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center w-full">
            Delete post
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col items-center justify-between">
          <p>Are you sure you want to delete this post?</p>
          <div className="flex items-center space-x-2 mt-5">
            <DialogClose asChild>
              <Button variant={"secondary"} className="w-full">
                Cancel
              </Button>
            </DialogClose>
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
      </DialogContent>
    </Dialog>
  );
};
export default DeletePost;
