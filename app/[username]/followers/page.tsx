import { ProfileAvatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";

const Followers = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen max-w-screen-sm mx-auto mt-14 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
          <div className="flex justify-evenly items-center border-b gap-14 px-4">
            <Link
              href={"/profile/followers"}
              className="border-b-2 border-b-black dark:border-b-white py-2"
            >
              143 Followers
            </Link>
            <Link href={"/profile/following"} className=" py-2">
              50 Following
            </Link>
          </div>
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
            <h2 className="font-semibold my-4">All Followers</h2>
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center space-x-4 h-fit">
                <ProfileAvatar
                  image="https://github.com/shadcn.png"
                  alt="profile"
                  width="12"
                  height="12"
                />
                <div>
                  <h2 className="truncate">its_me_prasad</h2>
                  <p className="truncate text-xs">Prasad Kumar</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant={"blue"}>Follow back</Button>
                <Button asChild variant={"ghost"}>
                  <div>
                    <X />
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center space-x-4 h-fit">
                <ProfileAvatar
                  image="https://github.com/shadcn.png"
                  alt="profile"
                  width="12"
                  height="12"
                />
                <div>
                  <h2 className="truncate">its_me_prasad</h2>
                  <p className="truncate text-xs">Prasad Kumar</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button className="px-6" variant={"outline"}>
                  Message
                </Button>
                <Button asChild variant={"ghost"}>
                  <div>
                    <X />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Followers;
