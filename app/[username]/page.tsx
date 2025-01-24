import { Suspense } from "react";
import Loading from "@/app/[username]/loading";
import {
  BookmarkIcon,
  Contact2Icon,
  HeartIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  MessageCircleCode,
} from "lucide-react";
import ProfileCard from "@/components/profile/profile";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserByUsername } from "@/lib/actions/user.actions";
import { auth } from "@/auth";
import Image from "next/image";
import Footer from "@/components/layout/footer";

const Profile = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  if (!session) redirect("/login");

  const { username } = await params;
  const user = await getUserByUsername(username);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <ProfileCard />
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
        {user?.postsCount === 0 && (
          <div className="w-full flex flex-col justify-center items-center space-y-4 mt-14 p-2">
            <div className="border w-20 h-20 p-4 rounded-full flex  items-center justify-center">
              <ImagesIcon size={40} strokeWidth={1} />
            </div>
            <h1 className="text-2xl font-bold">Posts of you</h1>
            <p>When you post photos, they &apos; ll appear here.</p>
          </div>
        )}
        <div className="w-full grid grid-cols-3 gap-1 mb-5">
          {user?.posts &&
            user?.posts.map((post) => (
              <Link
                href={`/p/${post?.id}`}
                key={post?.id}
                className="relative group"
              >
                <Image
                  src={post?.images[0]?.url}
                  width={100}
                  height={100}
                  sizes="100%"
                  loading="lazy"
                  className="w-full h-[180px] md:h-[300px] object-cover"
                  alt="post"
                />
                <div className="absolute top-0 right-0 w-full h-full  justify-center items-center gap-8 bg-black/40 hidden group-hover:flex">
                  <p className="flex items-center text-white gap-2 font-semibold">
                    <HeartIcon color="white" fill="white" />{" "}
                    <span>{post?.likesCount}</span>
                  </p>
                  <p className="flex items-center text-white gap-2 font-semibold">
                    <MessageCircleCode
                      color="white"
                      fill="white"
                      className="-rotate-90"
                    />{" "}
                    <span>{post?.likesCount}</span>
                  </p>
                </div>
              </Link>
            ))}
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default Profile;
