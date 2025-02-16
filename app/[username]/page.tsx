import Loading from "@/app/[username]/loading";
import { BookmarkIcon, Contact2Icon, LayoutDashboardIcon } from "lucide-react";
import ProfileCard from "@/components/profile/profile";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getloginUserId,
  getUserByUsername,
  isFollower,
} from "@/lib/actions/user.actions";
import { auth } from "@/auth";
import NotFound from "../not-found";
import { UserProfileInterface } from "@/types/types";
import { Suspense } from "react";
import UserPosts from "@/components/profile/posts";

const Profile = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const session = await auth();
  if (!session) redirect("/login");

  const loginUser = await getloginUserId(session?.user?.email as string);

  const username = (await params).username;

  if (!username) return <NotFound />;

  const user: UserProfileInterface | undefined = (await getUserByUsername(
    username
  )) as UserProfileInterface;

  if (!user) return <NotFound />;

  if (username !== user?.username) return <NotFound />;

  const isFollowerUser = await isFollower(
    loginUser?.id as string,
    user?.id as string
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <ProfileCard
          userId={user?.id as string}
          username={user?.username as string}
          image={user?.image as string}
          fullName={user?.name as string}
          bio={user?.bio as string}
          followersCount={user?.followersCount as number}
          followingCount={user?.followingCount as number}
          postsCount={user?.postsCount as number}
          loginUserId={loginUser?.id as string}
          isPrivate={user?.isPrivate as boolean}
          isFollowerUser={isFollowerUser as boolean}
        />

        {(loginUser?.id === user?.id ||
          !user?.isPrivate ||
          (user?.isPrivate && isFollowerUser)) && (
          <>
            <div className="w-full flex justify-center items-center border-t space-x-10 md:space-x-20">
              <Link
                href={`/${username}`}
                className="border-t-2 border-t-black dark:border-t-white py-2 px-2 flex items-center gap-2"
              >
                <LayoutDashboardIcon size={16} /> <span>Posts</span>
              </Link>
              <Link
                href={`/${username}/saved`}
                className="py-2 px-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"
              >
                <BookmarkIcon size={16} /> <span>Saved</span>
              </Link>
              <Link
                href={`/${username}/tagged`}
                className="py-2 px-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"
              >
                <Contact2Icon size={16} /> <span>Tagged</span>
              </Link>
            </div>
            <UserPosts userId={user?.id as string} />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Profile;
