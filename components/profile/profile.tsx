import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyProfileLink from "./share-profile";
import HandleProfileFollow from "./handle-follow";
import Followers from "./followers";
import Following from "./following";

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
}) => {
  return (
    <>
      <div className="w-full mx-auto">
        <div className="px-0 md:px-4 pt-0 md:pt-6">
          <div className="flex items-center justify-between md:justify-evenly space-x-14 w-full px-4 md:px-0">
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
            <div className="flex flex-col items-center justify-center">
              <div className="flex space-x-2 md:space-x-4 text-center md:text-left py-4 w-full">
                <p>
                  <span className="font-semibold">{postsCount}</span> posts
                </p>
                <div>
                  <Followers
                    userId={userId}
                    loginUserId={loginUserId}
                    username={username}
                    followersCount={followersCount}
                  />
                </div>
                <div>
                  <Following
                    userId={userId}
                    loginUserId={loginUserId}
                    username={username}
                    followingCount={followingCount}
                  />
                </div>
              </div>
              <div className="hidden md:flex flex-col w-full px-4 md:px-0 text-sm">
                <h1 className="font-semibold py-2">{fullName}</h1>
                <p className="py-1">@{username}</p>
                <p>{bio ? bio : "Update your bio..."}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full px-4 md:px-0 text-sm md:text-base md:hidden">
            <h1 className="font-semibold py-2">Prasad Kumar</h1>
            <p>@{username}</p>
            <p>{bio ? bio : "Update your bio..."}</p>
          </div>

          {loginUserId !== userId && (
            <div className="w-full my-8 md:mx-0 flex justify-around gap-4">
              <HandleProfileFollow userId={loginUserId} isUserId={userId} />
              <Link href={`/${username}/edit`} className="w-full mr-4 md:ml-0">
                <Button variant={"secondary"} className="w-full">
                  Message
                </Button>
              </Link>
            </div>
          )}
          {loginUserId === userId && (
            <div className="w-full my-8 md:mx-0 flex justify-around gap-4">
              <Link href={`/${username}/edit`} className="w-full ml-4 md:ml-0">
                <Button className="w-full">Edit profile</Button>
              </Link>
              <CopyProfileLink
                text={`${process.env.NEXT_PUBLIC_URL}/${username}`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ProfileCard;
