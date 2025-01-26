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
  getFollowers,
  getloginUserId,
} from "@/lib/actions/user.actions";
import { FollowerInterface } from "@/types/types";
import HandleMutualFollow from "@/components/profile/mutual-follow";

const Followers = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  if (!session) redirect("/login");

  const { username } = await params;
  const user = await getFollowCount(username);

  const loginUser = await getloginUserId(session?.user?.email as string);

  const followers: FollowerInterface[] = await getFollowers(user?.id as string);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen max-w-screen-sm mx-auto mt-14 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
          <div className="flex justify-evenly items-center border-b gap-14 px-4">
            <Link
              href={`/${username}/followers`}
              className="border-b-2 border-b-blue-500 dark:border-b-blue-500 py-2 text-blue-500"
            >
              {user?.followersCount} Followers
            </Link>
            <Link
              href={`/${username}/following`}
              className=" py-2 hover:text-blue-500"
            >
              {user?.followingCount} Following
            </Link>
          </div>

          {followers && followers.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center mt-14 px-5">
              <div className="p-5 border-2 rounded-full">
                <UsersRoundIcon size={40} strokeWidth={1} />
              </div>
              <h1 className="text-2xl opacity-90 mt-5">
                Invite Friends to Follow You
              </h1>
              <p className="text-sm opacity-90 text-center">
                Reach out and connect with people to grow your follower list.
              </p>
            </div>
          )}
          {followers && followers.length > 0 && (
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
                {followers.map((followerInfo) => (
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
                            ? `${followerInfo?.follower?.name.slice(0, 15)}...`
                            : followerInfo?.follower?.name}
                        </p>
                        <p className="truncate w-full hidden md:flex text-xs opacity-65">
                          {followerInfo?.follower?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 min-w-3/6 max-w-3/6">
                      <HandleMutualFollow
                        currentUserId={loginUser?.id as string}
                        profileUserId={followerInfo?.follower?.id as string}
                        isLoginUserFollowersPage={
                          loginUser?.id === followerInfo?.followingId
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
export default Followers;
