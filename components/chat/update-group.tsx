"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  FollowerInterface,
  FollowingInterface,
  Participant,
  UserInfo,
} from "@/types/types";
import { CheckIcon, EllipsisIcon, X } from "lucide-react";
import { ProfileAvatar } from "../avatar";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getFollowers, getFollowing } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addParticipants,
  deleteConversation,
  removeParticipant,
  updateGroupName,
} from "@/lib/actions/realtime.actions";

const UpdateGroup = ({
  conversationId,
  userId,
  owner,
  participants,
}: {
  conversationId: string;
  userId: string;
  owner: string;
  participants: Participant[];
}) => {
  const [change, setChange] = useState<boolean>(false);
  const [group, setGroup] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchPeople = async () => {
      // Fetch followers and following
      const followers: FollowerInterface[] = await getFollowers(userId);
      const following: FollowingInterface[] = await getFollowing(userId);

      // Map each to a common UserInfo array.
      const followerUsers: UserInfo[] = followers.map((f) => f.follower);
      const followingUsers: UserInfo[] = following.map((f) => f.following);

      // Combine both arrays
      const combinedUsers: UserInfo[] = [...followerUsers, ...followingUsers];

      // Remove duplicate users by using a Map keyed by user.id
      const uniqueUsers: UserInfo[] = Array.from(
        new Map(combinedUsers.map((user) => [user.id, user])).values()
      );

      // Filter out users that are already in the group (participants)
      const filteredUsers: UserInfo[] = uniqueUsers.filter(
        (user) => !participants.some((p) => p.userId === user.id)
      );

      setUsers(filteredUsers);
    };

    fetchPeople();
  }, [userId, participants]); // Include participants if they might change

  const handleRemove = (id: string) => {
    setGroup((prev) => prev.filter((userId) => userId !== id));

    startTransition(() => {
      removeParticipant(conversationId, id).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          router.refresh();
        }
      });
    });
  };

  const handleLeave = (id: string) => {
    startTransition(() => {
      removeParticipant(conversationId, id).then((data) => {
        if (data?.success) {
          toast.success("You have left the group");
          router.push("/inbox");
        }
      });
    });
  };

  const handleAdd = () => {
    if (group.length === 0) {
      toast.error("Please select at least one user to add");
      return;
    }
    startTransition(() => {
      addParticipants(conversationId, group).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          setOpen(false);
          router.refresh();
        }
      });
    });
  };

  const handleAddName = () => {
    if (groupName.length === 0) return toast.error("Please enter a group name");
    if (groupName.length > 25) {
      toast.error("Maximum group name length is 20 characters");
      return;
    }
    startTransition(() => {
      updateGroupName(conversationId, groupName).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          setChange(false);
          router.refresh();
        }
      });
    });
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteConversation(conversationId).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          setOpenDelete(false);
          router.push("/inbox");
        }
      });
    });
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <EllipsisIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Details</SheetTitle>
          </SheetHeader>
          <Separator className=" my-2 md:my-4" />
          <div>
            <div className="flex justify-between">
              <h3 className="font-semibold">Members</h3>
              {users?.length > 0 && owner === userId && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <span className="flex gap-1 text-sm text-blue-500">
                      Add People
                    </span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="items-center">
                      <DialogTitle>Create Group</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <div>
                      <h2 className="my-2">Suggested</h2>
                      <ScrollArea className="w-full h-[50vh] md:h-[50vh]">
                        <div>
                          {users?.map((user) => (
                            <div
                              key={user.id}
                              className="flex justify-between md:px-4 py-2 cursor-pointer md:hover:bg-gray-100 md:dark:hover:bg-gray-800 my-2"
                              onClick={() => {
                                setGroup((prev) =>
                                  prev.includes(user.id)
                                    ? prev.filter((id) => id !== user.id)
                                    : [...prev, user.id]
                                );
                              }}
                            >
                              <div className="flex gap-3 truncate items-center">
                                <ProfileAvatar
                                  image={user.image as string}
                                  alt="profile"
                                  width="12"
                                  height="12"
                                />
                                <p>{user.username}</p>
                              </div>
                              <div className="flex items-center">
                                {group.includes(user.id) ? (
                                  <CheckIcon
                                    className="rounded-full bg-[#0095f6] p-[2px]"
                                    size={24}
                                    color="white"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <Button className="w-full" onClick={handleAdd}>
                        Next
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <ScrollArea className="w-full h-[50vh] md:h-[55vh] md:max-h-[55vh] my-3">
              {participants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center justify-between md:hover:bg-gray-200 md:dark:hover:bg-gray-800 px-0 md:px-2 my-1"
                >
                  <Link
                    href={`/${participant?.user.username}`}
                    className="w-full"
                  >
                    <div className="flex items-center gap-2 md:gap-4 my-2">
                      <ProfileAvatar
                        image={participant?.user.image as string}
                        width="12"
                        height="12"
                        alt="profile"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-sm w-full truncate">
                          {participant?.user.username}
                        </p>
                        {participant?.userId === owner && (
                          <p className="text-xs opacity-70">Admin</p>
                        )}
                      </div>
                    </div>
                  </Link>
                  {owner === userId && owner !== participant.userId && (
                    <div
                      className="cursor-pointer pr-2"
                      onClick={() => handleRemove(participant.userId)}
                      aria-disabled={isPending}
                    >
                      <X strokeWidth={1} color="red" />
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
            {owner === userId && (
              <div className="flex gap-1 mb-2">
                {change ? (
                  <div className="flex gap-1 w-full">
                    <Input
                      type="text"
                      name="name"
                      placeholder="Group name"
                      className="w-full"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                    <Button onClick={() => handleAddName()}>Save</Button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    <p className="w-full truncate">Change group name</p>
                    <Button
                      onClick={() => setChange(!change)}
                      variant={"secondary"}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {participants.length > 1 && owner !== userId && (
                <Button
                  variant={"link"}
                  className="p-0 text-red-500"
                  onClick={() => handleLeave(userId)}
                >
                  Leave chat
                </Button>
              )}
              <SheetDescription>
                You won&apos;t be able to send or receive messages unless
                someone adds you back to the chat.
              </SheetDescription>
              {owner === userId && (
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                  <DialogTrigger asChild>
                    <Button variant={"link"} className="p-0 text-red-500">
                      Delete chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete this chat?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                    <div className="flex justify-end space-x-4">
                      <Button
                        variant={"secondary"}
                        onClick={() => setOpenDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={handleDelete}
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
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default UpdateGroup;
