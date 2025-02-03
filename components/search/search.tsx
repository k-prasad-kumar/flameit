"use client";

import { SearchIcon } from "lucide-react";
import { ProfileAvatar } from "../avatar";
import { Input } from "../ui/input";
import { UserInfo } from "@/types/types";
import { Suspense, useEffect, useState } from "react";
import { fetchUsers } from "@/lib/actions/user.actions";
import Link from "next/link";
import Loading from "@/app/search/loading";

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [usersData, setUsersData] = useState<UserInfo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(async () => {
      try {
        const newUsers: UserInfo[] | undefined = (await fetchUsers(
          "",
          page * 15,
          15
        )) as UserInfo[];

        if (newUsers && newUsers.length > 0) {
          setUsersData((prevUsers) => [...prevUsers, ...newUsers]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false); // No more data to fetch
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const onScroll = () => {
    const scrollElement = document.documentElement;
    const isBottomReached =
      scrollElement.scrollHeight - scrollElement.scrollTop <=
      scrollElement.clientHeight + 200; // Adjust buffer

    if (isBottomReached && hasMore) {
      loadMoreData();
    }
  };

  // Debounce scroll event for better performance
  useEffect(() => {
    const debouncedScroll = () => {
      if (!loading) {
        onScroll();
      }
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  // Fetch initial posts on component mount
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const initialData: UserInfo[] | undefined = (await fetchUsers(
          query,
          0,
          15
        )) as UserInfo[];
        setUsersData(initialData || []);
      } catch (error) {
        console.error("Failed to fetch initial posts:", error);
      }
    };
    fetchInitialUsers();
  }, [query]);

  return (
    <Suspense fallback={<Loading />}>
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {usersData.length > 0 &&
          usersData.map((user) => (
            <Link
              href={`/${user.username}`}
              className="flex flex-col px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-900"
              key={user.id}
            >
              <div className="flex items-center justify-between my-2">
                <div className="flex items-center space-x-4 h-fit">
                  <ProfileAvatar
                    image={user?.image as string}
                    alt="profile"
                    width="12"
                    height="12"
                  />
                  <div>
                    <h2 className="truncate">{user?.username}</h2>
                    <p className="truncate text-xs">{user?.name}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        {loading && (
          <div className="w-full flex justify-center items-center mt-4 mb-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        )}
        {!hasMore && !loading && (
          <div className="text-center text-gray-500 mt-4 mb-24">
            You have reached the end.
          </div>
        )}
      </div>
    </Suspense>
  );
};
export default SearchPage;
