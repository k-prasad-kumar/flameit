"use client";

import { getUserPosts } from "@/lib/actions/user.actions";
import { UserPostsInterface } from "@/types/types";
import { HeartIcon, ImagesIcon, MessageCircleCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserPosts = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState<UserPostsInterface[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(async () => {
      try {
        const newPosts: UserPostsInterface[] | undefined = (await getUserPosts(
          userId,
          page * 12,
          12
        )) as UserPostsInterface[];

        if (newPosts && newPosts.length > 0) {
          setPostsData((prevPosts) => [...prevPosts, ...newPosts]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false); // No more data to fetch
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const onScroll = () => {
    const scrollElement = document.documentElement;

    // Do nothing if the content is too short to scroll.
    if (scrollElement.scrollHeight <= scrollElement.clientHeight) return;

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
    const fetchInitialPosts = async () => {
      try {
        const initialData: UserPostsInterface[] | undefined =
          (await getUserPosts(userId, 0, 12)) as UserPostsInterface[];
        setPostsData(initialData || []);
      } catch (error) {
        console.error("Failed to fetch initial posts:", error);
      }
    };
    fetchInitialPosts();
  }, [userId]);

  return (
    <div>
      {postsData.length === 0 && !loading ? (
        <div className="w-full flex flex-col justify-center items-center space-y-4 mt-14 p-2 mb-5">
          <div className="border w-20 h-20 p-4 rounded-full flex  items-center justify-center">
            <ImagesIcon size={40} strokeWidth={1} />
          </div>
          <h1 className="text-2xl font-bold">Posts of you</h1>
          <p>When you post photos, they &apos;ll appear here.</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-3 gap-1 mb-14">
          {postsData.map((post, idx) => (
            <Link href={`/p/${post?.id}`} key={idx} className="relative group">
              <Image
                src={post?.image.url}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-full h-[180px] md:h-[300px] object-cover"
                alt="post"
              />
              <div className="absolute top-0 right-0 w-full h-full justify-center items-center gap-8 bg-black/40 hidden group-hover:flex">
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
                  <span>{post?.commentsCount}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
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
  );
};

export default UserPosts;
