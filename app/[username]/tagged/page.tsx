import { BookmarkIcon, Contact2Icon, LayoutDashboardIcon } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import ProfileCard from "@/components/profile/profile";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { getloginUserId, getUserTaggedPosts } from "@/lib/actions/user.actions";
import { UserTaggedInterface } from "@/types/types";
import NotFound from "@/app/not-found";

const Tagged = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  if (!session) redirect("/login");

  const loginUser = await getloginUserId(session?.user?.email as string);

  const { username } = await params;

  const user: UserTaggedInterface | undefined = (await getUserTaggedPosts(
    username
  )) as UserTaggedInterface;

  if (!user) return <NotFound />;
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
        />
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

        {user?.tagged.length === 0 && (
          <div className="w-full flex flex-col justify-center items-center space-y-4 mt-14 p-2">
            <div className="border w-20 h-20 p-4 rounded-full flex  items-center justify-center">
              <Contact2Icon size={40} strokeWidth={1} />
            </div>
            <h1 className="text-2xl font-bold">Photos of you</h1>
            <p>When people tag you in photos, they &apos; ll appear here.</p>
          </div>
        )}

        <div className="w-full grid grid-cols-3 gap-1 mb-5">
          {user?.tagged.length > 0 &&
            user?.tagged.map((tagged, index) => (
              <Link
                href={`/p/${tagged?.post?.id}`}
                key={index}
                className="relative group"
              >
                <Image
                  src={tagged?.post?.images[0].url as string}
                  width={100}
                  height={100}
                  sizes="100%"
                  loading="lazy"
                  className="w-full h-[180px] md:h-[300px] object-cover"
                  alt="post"
                />
              </Link>
            ))}
        </div>
      </div>
    </Suspense>
  );
};
export default Tagged;
