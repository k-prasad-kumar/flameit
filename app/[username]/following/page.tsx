import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getFollowCount,
  getFollowing,
  getloginUserId,
} from "@/lib/actions/user.actions";
import { FollowingInterface } from "@/types/types";
import HandleMutualFollow from "@/components/profile/mutual-follow";

const Foloowing = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  if (!session) redirect("/login");

  const { username } = await params;
  const user = await getFollowCount(username);

  const loginUser = await getloginUserId(session?.user?.email as string);

  const following: FollowingInterface[] = await getFollowing(
    user?.id as string
  );
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen max-w-screen-sm mx-auto mt-14 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
          <div className="flex justify-evenly items-center border-b gap-14 px-4">
            <Link
              href={`/${username}/followers`}
              className="py-2 hover:text-blue-500"
            >
              {user?.followersCount} Followers
            </Link>
            <Link
              href={`/${username}/following`}
              className="border-b-2 border-b-blue-500 dark:border-b-blue-500 text-blue-500 py-2"
            >
              {user?.followingCount} Following
            </Link>
          </div>

          {following && following.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center mt-14">
              <div className="p-5 border-2 rounded-full">
                <UsersRoundIcon size={40} strokeWidth={1} />
              </div>
              <h1 className="text-2xl opacity-90 mt-5">
                Discover New Connections
              </h1>
              <p className="text-sm opacity-90">
                Follow others to get updates and stay in the loop.
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

              <div className="flex flex-col mx-4 max-w-full">
                {following.map((followingInfo) => (
                  <div
                    className="flex items-center justify-between my-2"
                    key={followingInfo.id}
                  >
                    <div className="flex items-center space-x-2 md:space-x-4 w-1/6">
                      <ProfileAvatar
                        image={followingInfo?.following?.image as string}
                        alt="profile"
                        width="12"
                        height="12"
                      />
                      <div className="flex flex-col min-w-2/6 max-w-2/6">
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
                    <div className="flex items-center justify-end space-x-2 min-w-3/6 max-w-3/6">
                      <HandleMutualFollow
                        currentUserId={loginUser?.id as string}
                        profileUserId={followingInfo?.following?.id as string}
                        isLoginUserFollowersPage={
                          loginUser?.id === followingInfo?.followerId
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};
export default Foloowing;
