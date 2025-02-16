import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyProfileLink from "./share-profile";
import HandleProfileFollow from "./handle-follow";
import { AtSignIcon } from "lucide-react";
import TruncateBio from "./bio-truncate";
import AddConversation from "./add-conversation";

import dynamic from "next/dynamic";

import PrivateFollow from "./private-follow";
import { isFollowerRequested } from "@/lib/actions/user.actions";

const DynamicFollowers = dynamic(() => import("./followers"));
const DynamicFollowing = dynamic(() => import("./following"));

const ProfileCard = async ({
  loginUserId,
  userId,
  username,
  image,
  fullName,
  bio,
  followersCount,
  followingCount,
  postsCount,
  isPrivate,
  isFollowerUser,
}: {
  loginUserId: string;
  userId: string;
  username: string;
  image: string;
  fullName: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isPrivate: boolean;
  isFollowerUser: boolean;
}) => {
  const isFollowerRequest = await isFollowerRequested(loginUserId, userId);
  return (
    <>
      <div className="w-full mx-auto">
        <div className="px-0 md:px-4 pt-0 md:pt-6 w-full">
          <div className="flex items-center justify-between md:justify-evenly space-x-14 px-4 md:px-0">
            <div className="w-1/4 md:w-2/5 flex justify-center items-center">
              <Avatar
                className={`max-w-20 max-h-20 w-20 h-20 md:max-w-36 md:max-h-36 md:w-36 md:h-36`}
              >
                <AvatarImage
                  src={image ? image : "https://github.com/shadcn.png"}
                  alt="profile"
                  className="w-full h-auto"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center justify-center w-3/4 md:w-3/5">
              <div className="flex space-x-2 md:space-x-4 text-center md:text-left py-4 w-full">
                <p>
                  <span className="font-semibold">{postsCount}</span> posts
                </p>
                {isPrivate && loginUserId !== userId && !isFollowerUser ? (
                  <>
                    <div>
                      <p>
                        {" "}
                        <span className="font-semibold">
                          {" "}
                          {followersCount}
                        </span>{" "}
                        Followers
                      </p>
                    </div>
                    <div>
                      <p>
                        {" "}
                        <span className="font-semibold">
                          {followingCount}
                        </span>{" "}
                        Following
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <DynamicFollowers
                        userId={userId}
                        loginUserId={loginUserId}
                        followersCount={followersCount}
                      />
                    </div>
                    <div>
                      <DynamicFollowing
                        userId={userId}
                        loginUserId={loginUserId}
                        username={username}
                        followingCount={followingCount}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="hidden md:flex flex-col w-full px-4 md:px-0 text-sm">
                <h1 className="font-semibold py-2">{fullName}</h1>
                <TruncateBio text={bio} maxLength={90} />
                <p className="font-semibold px-4 py-1 rounded bg-gray-100 dark:bg-gray-800 w-fit mt-3 flex items-center">
                  <span className="h-full border mr-1">
                    <AtSignIcon size={16} />
                  </span>{" "}
                  <span>{username}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full px-4 md:px-0 text-sm md:text-base md:hidden">
            <h1 className="font-semibold py-2">{fullName}</h1>
            <TruncateBio text={bio} maxLength={70} />
            <p className="font-semibold px-4 py-1 rounded bg-gray-100 dark:bg-gray-800 w-fit mt-3 flex items-center">
              <span className="h-full mr-1">
                <AtSignIcon size={16} />
              </span>{" "}
              <span>{username}</span>
            </p>
          </div>

          {loginUserId === userId ||
          !isPrivate ||
          (isPrivate && isFollowerUser) ? (
            <>
              {loginUserId === userId && (
                <div className="w-full my-8 md:mx-0 flex justify-around gap-4">
                  <Link
                    href={`/${username}/edit`}
                    className="w-full ml-4 md:ml-0"
                  >
                    <Button className="w-full">Edit profile</Button>
                  </Link>
                  <CopyProfileLink
                    text={`${process.env.NEXT_PUBLIC_URL}/${username}`}
                  />
                </div>
              )}

              {loginUserId !== userId && (
                <div className="w-full my-8 md:mx-0 flex justify-around gap-4">
                  <HandleProfileFollow userId={loginUserId} isUserId={userId} />
                  <AddConversation loginUserId={loginUserId} userId={userId} />
                </div>
              )}
            </>
          ) : (
            <PrivateFollow
              loginUserId={loginUserId}
              userId={userId}
              isFollowerRequest={isFollowerRequest}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default ProfileCard;
