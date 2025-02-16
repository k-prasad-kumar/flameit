import { BookmarkIcon, Contact2Icon, LayoutDashboardIcon } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import ProfileCard from "@/components/profile/profile";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getloginUserId,
  getUserByUsername,
  isFollower,
} from "@/lib/actions/user.actions";
import { UserProfileInterface } from "@/types/types";
import NotFound from "@/app/not-found";
import TaggedPosts from "@/components/profile/tagged";

const Tagged = async ({
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

  const isFollowerUser = await isFollower(
    loginUser?.id as string,
    user?.id as string
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <ProfileCard
          loginUserId={loginUser?.id as string}
          userId={user?.id as string}
          username={user?.username as string}
          image={user?.image as string}
          fullName={user?.name as string}
          bio={user?.bio as string}
          followersCount={user?.followersCount as number}
          followingCount={user?.followingCount as number}
          postsCount={user?.postsCount as number}
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
                className=" text-slate-500 dark:text-slate-400 py-2 px-2 flex items-center gap-2"
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
                className="py-2 px-2 flex items-center gap-2 border-t-2 border-t-black dark:border-t-white"
              >
                <Contact2Icon size={16} /> <span>Tagged</span>
              </Link>
            </div>

            <TaggedPosts userId={user?.id as string} />
          </>
        )}
      </div>
    </Suspense>
  );
};
export default Tagged;
