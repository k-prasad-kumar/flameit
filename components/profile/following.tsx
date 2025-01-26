import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getFollowing } from "@/lib/actions/user.actions";
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
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

const Following = async ({
  userId,
  loginUserId,
  username,
  followingCount,
}: {
  userId: string;
  loginUserId: string;
  username: string;
  followingCount: number;
}) => {
  if (!username) return;

  const following: FollowingInterface[] = await getFollowing(userId as string);

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
            <Separator />
            <ScrollArea className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] py-2">
              {following && following.length === 0 && (
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
              {following && following.length > 0 && (
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
                  <div className="flex flex-col mx-4  max-w-full">
                    {following.map((followingInfo) => (
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger>
            <span className="font-semibold">{followingCount}</span> following{" "}
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] min-h-[80vh]">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Following</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[80vh] max-h-[80vh] md:h-[80vh] md:max-h-[80vh] py-2">
              {following && following.length === 0 && (
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
              {following && following.length > 0 && (
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
                  <div className="flex flex-col mx-4  max-w-full">
                    {following.map((followingInfo) => (
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
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </Suspense>
  );
};
export default Following;
