import { Suspense } from "react";
import Loading from "./loading";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ProfileAvatar } from "@/components/avatar";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

const Search = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
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
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Search;
