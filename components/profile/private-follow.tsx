"use client";

import { useTransition } from "react";
import {
  addFollower,
  removeRequestedFollower,
} from "@/lib/actions/user.actions";
import { Separator } from "../ui/separator";
import { LockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const PrivateFollow = ({
  loginUserId,
  userId,
  isFollowerRequest,
}: {
  loginUserId: string;
  userId: string;
  isFollowerRequest: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollow = () => {
    if (loginUserId !== userId) {
      startTransition(() => {
        addFollower(loginUserId, userId).then((data) => {
          if (data?.success) {
            router.refresh();
          }
        });
      });
    }
  };

  const handleUnfollow = () => {
    if (loginUserId !== userId) {
      startTransition(() => {
        removeRequestedFollower(loginUserId, userId).then((data) => {
          if (data?.success) {
            router.refresh();
          }
        });
      });
    }
  };

  return (
    <div className="mt-14 w-full flex flex-col items-center justify-center">
      <Separator />
      <div className="flex items-center justify-center gap-4 mt-5">
        <div className="border-2 rounded-full">
          <LockIcon size={40} strokeWidth={1} className="m-2 p-1" />
        </div>

        <div className="flex flex-col gap-[2px] my-4">
          <p className="font-[500]">This account is private</p>
          <span className="text-sm opacity-75">Follow to see their photos</span>
        </div>
      </div>

      {isFollowerRequest ? (
        <Button
          variant={"secondary"}
          onClick={handleUnfollow}
          disabled={isPending}
        >
          <span
            className={`justify-center items-center ${
              isPending ? "flex" : "hidden"
            }`}
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          </span>
          Requested
        </Button>
      ) : (
        <Button variant={"blue"} onClick={handleFollow} disabled={isPending}>
          <span
            className={`justify-center items-center ${
              isPending ? "flex" : "hidden"
            }`}
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
          </span>
          Follow
        </Button>
      )}
    </div>
  );
};
export default PrivateFollow;
