"use client";

import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { fetchFollowing } from "@/lib/actions/user.actions";
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
import { FollowingInterface } from "@/types/types";
import HandleMutualFollow from "@/components/profile/mutual-follow";
import FollowersSkeleton from "../skeletons/followers-skeleton";
import { ScrollArea } from "../ui/scroll-area";

const Following = ({
  userId,
  loginUserId,
  followingCount,
}: {
  userId: string;
  loginUserId: string;
  followingCount: number;
}) => {
  const [followingList, setFollowingList] = useState<FollowingInterface[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const initialFollowing = useCallback(async () => {
    const following: FollowingInterface[] = await fetchFollowing(
      userId as string,
      query,
      0,
      10
    );
    if (following && following.length > 0) setPage((prevPage) => prevPage + 1);
    if (following && following.length < 10) setHasMore(false);
    if (following && following.length > 0) setFollowingList(following);
  }, [userId, query]);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(async () => {
      try {
        const following: FollowingInterface[] = await fetchFollowing(
          userId as string,
          query,
          page * 10,
          10
        );

        if (following && following.length > 0) {
          setFollowingList((prevUsers) => [...prevUsers, ...following]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false); // No more data to fetch
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const onScroll = () => {
    const scrollElement = document.documentElement;
    const isBottomReached =
      scrollElement.scrollHeight - scrollElement.scrollTop <=
      scrollElement.clientHeight + 400; // Adjust buffer

    if (isBottomReached && hasMore) {
      loadMoreData();
    }
  };

  // Debounce scroll event for better performance
  useEffect(() => {
    const debouncedScroll = () => {
      if (!loading) {
        onScroll();
      }
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  useEffect(() => {
    initialFollowing();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Suspense fallback={<FollowersSkeleton />}>
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <p className="cursor-pointer">
              <span className="font-semibold">{followingCount} </span> following{" "}
            </p>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-center w-full">
                Following
              </DialogTitle>
            </DialogHeader>
            {/* <Separator /> */}
            <ScrollArea
              className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] pb-4"
              onScroll={onScroll}
            >
              {followingList && followingList.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center mt-14 px-5">
                  <div className="p-5 border-2 rounded-full">
                    <UsersRoundIcon size={40} strokeWidth={1} />
                  </div>
                  <h1 className="text-2xl opacity-90 mt-5 text-center">
                    You&apos;re Not Following Anyone Yet
                  </h1>
                  <p className="text-sm opacity-90 text-center">
                    Discover and connect with amazing people! Start following
                    users to see their latest posts and updates here. Explore
                    trending content and grow your network today.
                  </p>
                </div>
              )}
              {followingList && followingList.length > 0 && (
                <>
                  <div className="relative mx-4 my-1">
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
                      onChange={(e) => setQuery(e.target.value)}
                      value={query}
                    />
                  </div>
                  <div className="flex flex-col mx-4 max-w-full">
                    {followingList.map((followingInfo) => (
                      <div
                        className="flex items-center justify-between my-2"
                        key={followingInfo.id}
                      >
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Link href={`/${followingInfo?.following?.username}`}>
                            <ProfileAvatar
                              image={followingInfo?.following?.image as string}
                              alt="profile"
                              width="12"
                              height="12"
                            />
                          </Link>
                          <div className="flex flex-col min-w-2/6 max-w-2/6">
                            <Link
                              href={`/${followingInfo?.following?.username}`}
                            >
                              <h2 className="truncate w-full flex md:hidden">
                                {followingInfo?.following?.username &&
                                followingInfo?.following?.username.length > 15
                                  ? `${followingInfo?.following?.username.slice(
                                      0,
                                      15
                                    )}...`
                                  : followingInfo?.following?.username}
                              </h2>
                              <h2 className="truncate w-full hidden md:flex">
                                {followingInfo?.following?.username}
                              </h2>
                            </Link>
                            <p className="truncate w-full flex md:hidden text-xs opacity-65">
                              {followingInfo?.following?.name &&
                              followingInfo?.following?.name.length > 15
                                ? `${followingInfo?.following?.name.slice(
                                    0,
                                    15
                                  )}...`
                                : followingInfo?.following?.name}
                            </p>
                            <p className="truncate w-full hidden md:flex text-xs opacity-65">
                              {followingInfo?.following?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 min-w-3/6 max-w-3/6">
                          <HandleMutualFollow
                            currentUserId={loginUserId as string}
                            profileUserId={
                              followingInfo?.following?.id as string
                            }
                            isLoginUserFollowersPage={
                              loginUserId === followingInfo?.followingId
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {loading && (
                <div className="w-full flex justify-center items-center mt-4 mb-24">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              )}
              {!hasMore && !loading && followingList.length > 0 && (
                <div className="text-center text-gray-500 mt-4 mb-24">
                  You have reached the end.
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger>
            <span className="font-semibold">{followingCount}</span> following{" "}
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh] min-h-[85vh]">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Following</p>
            </DrawerTitle>
            {/* <Separator /> */}
            <ScrollArea className="w-full h-[85vh] max-h-[85vh] md:h-[80vh] md:max-h-[80vh] pb-4">
              {followingList && followingList.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center mt-14 px-5">
                  <div className="p-5 border-2 rounded-full">
                    <UsersRoundIcon size={40} strokeWidth={1} />
                  </div>
                  <h1 className="text-2xl opacity-90 mt-5 text-center">
                    You&apos;re Not Following Anyone Yet
                  </h1>
                  <p className="text-sm opacity-90 text-center">
                    Discover and connect with amazing people! Start following
                    users to see their latest posts and updates here. Explore
                    trending content and grow your network today.
                  </p>
                </div>
              )}
              {followingList && followingList.length > 0 && (
                <>
                  <div className="relative mx-4">
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
                  <div className="flex flex-col mx-4  max-w-full">
                    {followingList.map((followingInfo) => (
                      <div
                        className="flex items-center justify-between my-2"
                        key={followingInfo.id}
                      >
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Link href={`/${followingInfo?.following?.username}`}>
                            <ProfileAvatar
                              image={followingInfo?.following?.image as string}
                              alt="profile"
                              width="12"
                              height="12"
                            />
                          </Link>
                          <div className="flex flex-col min-w-2/6 max-w-2/6">
                            <Link
                              href={`/${followingInfo?.following?.username}`}
                            >
                              <h2 className="truncate w-full flex md:hidden">
                                {followingInfo?.following?.username &&
                                followingInfo?.following?.username.length > 15
                                  ? `${followingInfo?.following?.username.slice(
                                      0,
                                      15
                                    )}...`
                                  : followingInfo?.following?.username}
                              </h2>
                              <h2 className="truncate w-full hidden md:flex">
                                {followingInfo?.following?.username}
                              </h2>
                            </Link>
                            <p className="truncate w-full flex md:hidden text-xs opacity-65">
                              {followingInfo?.following?.name &&
                              followingInfo?.following?.name.length > 15
                                ? `${followingInfo?.following?.name.slice(
                                    0,
                                    15
                                  )}...`
                                : followingInfo?.following?.name}
                            </p>
                            <p className="truncate w-full hidden md:flex text-xs opacity-65">
                              {followingInfo?.following?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 min-w-3/6 max-w-3/6">
                          <HandleMutualFollow
                            currentUserId={loginUserId as string}
                            profileUserId={
                              followingInfo?.following?.id as string
                            }
                            isLoginUserFollowersPage={
                              loginUserId === followingInfo?.followingId
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {loading && (
                <div className="w-full flex justify-center items-center mt-4 mb-24">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              )}
              {!hasMore && !loading && (
                <div className="text-center text-gray-500 mt-4 mb-24">
                  You have reached the end.
                </div>
              )}
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </Suspense>
  );
};
export default Following;
