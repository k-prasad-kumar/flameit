"use client";

import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState, useTransition } from "react";
import {
  acceptFollower,
  getFollowers,
  removeRequestedFollower,
} from "@/lib/actions/user.actions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FollowerInterface } from "@/types/types";
import HandleMutualFollow from "@/components/profile/mutual-follow";
import FollowersSkeleton from "../skeletons/followers-skeleton";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const Followers = ({
  userId,
  loginUserId,
  followersCount,
}: {
  userId: string;
  loginUserId: string;
  followersCount: number;
}) => {
  const [followers, setFollowers] = useState<FollowerInterface[]>([]);
  const [requestedFollowers, setRequestedFollowers] = useState<
    FollowerInterface[]
  >([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Dedicated function to fetch follower data
  const fetchFollowersData = async () => {
    try {
      const followersData = (await getFollowers(userId)) as {
        followers: FollowerInterface[] | undefined;
        requestedFollowers: FollowerInterface[] | undefined;
      };
      setFollowers(followersData.followers || []);
      setRequestedFollowers(followersData.requestedFollowers || []);
    } catch (error) {
      console.error("Error fetching followers data:", error);
    }
  };

  // Fetch on mount or when userId changes
  useEffect(() => {
    fetchFollowersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleFollow = (followerId: string, followingId: string) => {
    startTransition(() => {
      acceptFollower(followerId, followingId).then((data) => {
        if (data?.success) {
          // Refresh local state after accepting
          fetchFollowersData();
        }
      });
    });
  };

  const handleUnfollow = (followerId: string, followingId: string) => {
    setDeleteLoading(true);
    startTransition(() => {
      removeRequestedFollower(followerId, followingId).then((data) => {
        if (data?.success) {
          setDeleteLoading(false);
          // Refresh local state after deleting request
          fetchFollowersData();
        }
      });
    });
  };

  return (
    <Suspense fallback={<FollowersSkeleton />}>
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <p className="cursor-pointer">
              <span className="font-semibold">{followersCount} </span> followers{" "}
            </p>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-center w-full">
                Followers
              </DialogTitle>
            </DialogHeader>
            <Separator />
            <ScrollArea className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] py-2">
              {/* Show invite if no data exists */}
              {requestedFollowers.length === 0 && followers.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center mt-14 px-5">
                  <div className="p-5 border-2 rounded-full">
                    <UsersRoundIcon size={40} strokeWidth={1} />
                  </div>
                  <h1 className="text-2xl opacity-90 mt-5">
                    Invite Friends to Follow You
                  </h1>
                  <p className="text-sm opacity-90 text-center">
                    Reach out and connect with people to grow your follower
                    list.
                  </p>
                </div>
              )}

              {/* Follower requests */}
              {requestedFollowers.length > 0 && (
                <>
                  <div className="relative mx-4 my-4">
                    <SearchIcon
                      strokeWidth={1.5}
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 left-3"
                    />
                    <Input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search"
                      className="pl-10"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mx-4">
                    Follower requests
                  </h2>
                  <div className="flex flex-col mx-4 max-w-full">
                    {requestedFollowers.map((followerInfo) => (
                      <div
                        className="flex items-center justify-between my-2"
                        key={followerInfo.id}
                      >
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Link href={`/${followerInfo?.follower?.username}`}>
                            <ProfileAvatar
                              image={followerInfo?.follower?.image as string}
                              alt="profile"
                              width="12"
                              height="12"
                            />
                          </Link>
                          <div className="flex flex-col min-w-2/6 max-w-2/6">
                            <Link href={`/${followerInfo?.follower?.username}`}>
                              <h2 className="truncate w-full flex md:hidden">
                                {followerInfo?.follower?.username &&
                                followerInfo?.follower?.username.length > 15
                                  ? `${followerInfo?.follower?.username.slice(
                                      0,
                                      15
                                    )}...`
                                  : followerInfo?.follower?.username}
                              </h2>
                              <h2 className="truncate w-full hidden md:flex">
                                {followerInfo?.follower?.username}
                              </h2>
                            </Link>
                            <p className="truncate w-full flex md:hidden text-xs opacity-65">
                              {followerInfo?.follower?.name &&
                              followerInfo?.follower?.name.length > 15
                                ? `${followerInfo?.follower?.name.slice(
                                    0,
                                    15
                                  )}...`
                                : followerInfo?.follower?.name}
                            </p>
                            <p className="truncate w-full hidden md:flex text-xs opacity-65">
                              {followerInfo?.follower?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 min-w-3/6 max-w-3/6">
                          <Button
                            variant={"blue"}
                            disabled={isPending}
                            onClick={() =>
                              handleFollow(
                                followerInfo?.follower?.id as string,
                                followerInfo?.followingId as string
                              )
                            }
                          >
                            {isPending ? (
                              <span className="flex items-center">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                              </span>
                            ) : (
                              <span>Accept</span>
                            )}
                          </Button>
                          <Button
                            variant={"secondary"}
                            disabled={deleteLoading}
                            onClick={() =>
                              handleUnfollow(
                                followerInfo?.follower?.id as string,
                                followerInfo?.followingId as string
                              )
                            }
                          >
                            {deleteLoading ? (
                              <span className="flex items-center">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                              </span>
                            ) : (
                              <span>Delete</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Followers */}
              {followers.length > 0 && (
                <>
                  <div className="relative mx-4 my-4">
                    <SearchIcon
                      strokeWidth={1.5}
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 left-3"
                    />
                    <Input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search"
                      className="pl-10"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mx-4">Followers</h2>
                  <div className="flex flex-col mx-4 max-w-full">
                    {followers.map((followerInfo) => (
                      <div
                        className="flex items-center justify-between my-2"
                        key={followerInfo.id}
                      >
                        <div className="flex items-center space-x-4">
                          <Link href={`/${followerInfo?.follower?.username}`}>
                            <ProfileAvatar
                              image={followerInfo?.follower?.image as string}
                              alt="profile"
                              width="12"
                              height="12"
                            />
                          </Link>
                          <div className="flex flex-col min-w-2/6 max-w-2/6">
                            <Link href={`/${followerInfo?.follower?.username}`}>
                              <h2 className="truncate w-full flex md:hidden">
                                {followerInfo?.follower?.username &&
                                followerInfo?.follower?.username.length > 15
                                  ? `${followerInfo?.follower?.username.slice(
                                      0,
                                      15
                                    )}...`
                                  : followerInfo?.follower?.username}
                              </h2>
                              <h2 className="truncate w-full hidden md:flex">
                                {followerInfo?.follower?.username}
                              </h2>
                            </Link>
                            <p className="truncate w-full flex md:hidden text-xs opacity-65">
                              {followerInfo?.follower?.name &&
                              followerInfo?.follower?.name.length > 15
                                ? `${followerInfo?.follower?.name.slice(
                                    0,
                                    15
                                  )}...`
                                : followerInfo?.follower?.name}
                            </p>
                            <p className="truncate w-full hidden md:flex text-xs opacity-65">
                              {followerInfo?.follower?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <HandleMutualFollow
                            currentUserId={loginUserId as string}
                            profileUserId={followerInfo?.follower?.id as string}
                            isLoginUserFollowersPage={
                              loginUserId === followerInfo?.followingId
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex md:hidden">
        <Drawer>
          <DrawerTrigger>
            <span className="font-semibold">{followersCount}</span> followers{" "}
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] min-h-[80vh]">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Followers</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] py-2">
              {/* Show invite if no data exists */}
              {requestedFollowers.length === 0 && followers.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center mt-14 px-5">
                  <div className="p-5 border-2 rounded-full">
                    <UsersRoundIcon size={40} strokeWidth={1} />
                  </div>
                  <h1 className="text-2xl opacity-90 mt-5">
                    Invite Friends to Follow You
                  </h1>
                  <p className="text-sm opacity-90 text-center">
                    Reach out and connect with people to grow your follower
                    list.
                  </p>
                </div>
              )}

              {/* Follower requests */}
              {requestedFollowers.length > 0 && (
                <>
                  <div className="relative mx-4 my-4">
                    <SearchIcon
                      strokeWidth={1.5}
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 left-3"
                    />
                    <Input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search"
                      className="pl-10"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mx-4">
                    Follower requests
                  </h2>
                  <div className="flex flex-col mx-4 max-w-full">
                    {requestedFollowers.map((followerInfo) => (
                      <div
                        className="flex items-center justify-between my-2"
                        key={followerInfo.id}
                      >
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Link href={`/${followerInfo?.follower?.username}`}>
                            <ProfileAvatar
                              image={followerInfo?.follower?.image as string}
                              alt="profile"
                              width="12"
                              height="12"
                            />
                          </Link>
                          <div className="flex flex-col min-w-2/6 max-w-2/6">
                            <Link href={`/${followerInfo?.follower?.username}`}>
                              <h2 className="truncate w-full flex md:hidden">
                                {followerInfo?.follower?.username &&
                                followerInfo?.follower?.username.length > 15
                                  ? `${followerInfo?.follower?.username.slice(
                                      0,
                                      15
                                    )}...`
                                  : followerInfo?.follower?.username}
                              </h2>
                              <h2 className="truncate w-full hidden md:flex">
                                {followerInfo?.follower?.username}
                              </h2>
                            </Link>
                            <p className="truncate w-full flex md:hidden text-xs opacity-65">
                              {followerInfo?.follower?.name &&
                              followerInfo?.follower?.name.length > 15
                                ? `${followerInfo?.follower?.name.slice(
                                    0,
                                    15
                                  )}...`
                                : followerInfo?.follower?.name}
                            </p>
                            <p className="truncate w-full hidden md:flex text-xs opacity-65">
                              {followerInfo?.follower?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 min-w-3/6 max-w-3/6">
                          <Button
                            variant={"blue"}
                            disabled={isPending}
                            onClick={() =>
                              handleFollow(
                                followerInfo?.follower?.id as string,
                                followerInfo?.followingId as string
                              )
                            }
                          >
                            {isPending ? (
                              <span className="flex items-center">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                              </span>
                            ) : (
                              <span>Accept</span>
                            )}
                          </Button>
                          <Button
                            variant={"secondary"}
                            disabled={deleteLoading}
                            onClick={() =>
                              handleUnfollow(
                                followerInfo?.follower?.id as string,
                                followerInfo?.followingId as string
                              )
                            }
                          >
                            {deleteLoading ? (
                              <span className="flex items-center">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                              </span>
                            ) : (
                              <span>Delete</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Followers */}
              {followers.length > 0 && (
                <>
                  <div className="relative mx-4 my-4">
                    <SearchIcon
                      strokeWidth={1.5}
                      size={18}
                      className="absolute top-1/2 -translate-y-1/2 left-3"
                    />
                    <Input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search"
                      className="pl-10"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mx-4">Followers</h2>
                  <div className="flex flex-col mx-4 max-w-full">
                    {followers.map((followerInfo) => (
                      <div
                        className="flex items-center justify-between my-2"
                        key={followerInfo.id}
                      >
                        <div className="flex items-center space-x-4">
                          <Link href={`/${followerInfo?.follower?.username}`}>
                            <ProfileAvatar
                              image={followerInfo?.follower?.image as string}
                              alt="profile"
                              width="12"
                              height="12"
                            />
                          </Link>
                          <div className="flex flex-col min-w-2/6 max-w-2/6">
                            <Link href={`/${followerInfo?.follower?.username}`}>
                              <h2 className="truncate w-full flex md:hidden">
                                {followerInfo?.follower?.username &&
                                followerInfo?.follower?.username.length > 15
                                  ? `${followerInfo?.follower?.username.slice(
                                      0,
                                      15
                                    )}...`
                                  : followerInfo?.follower?.username}
                              </h2>
                              <h2 className="truncate w-full hidden md:flex">
                                {followerInfo?.follower?.username}
                              </h2>
                            </Link>
                            <p className="truncate w-full flex md:hidden text-xs opacity-65">
                              {followerInfo?.follower?.name &&
                              followerInfo?.follower?.name.length > 15
                                ? `${followerInfo?.follower?.name.slice(
                                    0,
                                    15
                                  )}...`
                                : followerInfo?.follower?.name}
                            </p>
                            <p className="truncate w-full hidden md:flex text-xs opacity-65">
                              {followerInfo?.follower?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <HandleMutualFollow
                            currentUserId={loginUserId as string}
                            profileUserId={followerInfo?.follower?.id as string}
                            isLoginUserFollowersPage={
                              loginUserId === followerInfo?.followingId
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </Suspense>
  );
};

export default Followers;
