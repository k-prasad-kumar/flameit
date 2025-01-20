import { BookmarkIcon, Contact2Icon, LayoutDashboardIcon } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import ProfileCard from "@/components/profile/profile";
import Link from "next/link";
import { getCurrentUser, getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

const Saved = async () => {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getCurrentUser();
  const username: string = user?.username as string;
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <ProfileCard />
        <div className="w-full flex justify-center items-center border-t space-x-10 md:space-x-20">
          <Link
            href={`/${username}`}
            className="text-slate-500 dark:text-slate-400 py-2 px-2 flex items-center gap-2"
          >
            <LayoutDashboardIcon size={16} /> <span>Posts</span>
          </Link>
          <Link
            href={`/${username}/saved`}
            className="py-2 px-2 flex items-center gap-2 border-t-2 border-t-black dark:border-t-white"
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
        <div className="w-full flex flex-col justify-center items-center space-y-4 mt-14 p-2">
          <div className="border w-20 h-20 p-4 rounded-full flex  items-center justify-center">
            <BookmarkIcon size={40} strokeWidth={1} />
          </div>
          <h1 className="text-2xl font-bold">Saved Posts of you</h1>
          <p>When you save posts, they &apos; ll appear here.</p>
        </div>
      </div>
    </Suspense>
  );
};
export default Saved;
