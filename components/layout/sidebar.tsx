import { HomeIcon, MessageCircle, SearchIcon } from "lucide-react";
import Link from "next/link";
import { ProfileAvatar } from "../avatar";
import { getCurrentUser } from "@/lib/get-session";
import CreatePost from "@/components/post/create-post";

const Sidebar = async () => {
  const user = await getCurrentUser();
  return (
    <div className="fixed left-1/2 bottom-0 -translate-x-1/2 md:left-9 md:top-1/2 md:-translate-y-1/2 px-3 flex md:flex-col justify-between md:justify-center items-center md:gap-5 w-full md:w-fit bg-white dark:bg-black border md:border-none">
      <Link
        href="/"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg"
      >
        <HomeIcon size={28} />
      </Link>
      <Link
        href="/search"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg"
      >
        <SearchIcon size={28} />
      </Link>
      <div className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-center">
        <CreatePost />
      </div>
      <Link
        href="/inbox"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg"
      >
        <MessageCircle size={28} />
      </Link>
      <div className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-lg cursor-pointer">
        <Link href={`/${user?.username}`}>
          <ProfileAvatar
            image={`${
              user?.image ? user?.image : "https://github.com/shadcn.png"
            }`}
            alt="profile"
            width="8"
            height="8"
          />
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;
