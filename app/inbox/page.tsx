import { Suspense } from "react";
import Loading from "./loading";
import { ProfileAvatar } from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";

const Inbox = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const username: string = user?.username as string;
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
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
          <div className="flex flex-col mx-4">
            <Link
              href={`/inbox/chat`}
              className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2"
            >
              <div className="flex items-center space-x-4 h-fit">
                <ProfileAvatar
                  image="https://github.com/shadcn.png"
                  alt="profile"
                  width="12"
                  height="12"
                />
                <div>
                  <h2 className="truncate">{username}</h2>
                  <p className="truncate text-xs">Active now</p>
                </div>
              </div>
            </Link>
            <Link
              href={`/inbox/chat`}
              className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2"
            >
              <div className="flex items-center space-x-4 h-fit">
                <ProfileAvatar
                  image="https://github.com/shadcn.png"
                  alt="profile"
                  width="12"
                  height="12"
                />
                <div>
                  <h2 className="truncate">{username}</h2>
                  <p className="truncate text-xs">Seen</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Inbox;
