"use client";

import { getUserTaggedPosts } from "@/lib/actions/user.actions";
import { TaggedInterface } from "@/types/types";
import { Contact2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const TaggedPosts = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState<TaggedInterface[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(async () => {
      try {
        const newPosts: TaggedInterface[] | undefined =
          (await getUserTaggedPosts(userId, page * 6, 6)) as TaggedInterface[];

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
        const initialData: TaggedInterface[] | undefined =
          (await getUserTaggedPosts(userId, 0, 6)) as TaggedInterface[];
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
        <div className="w-full flex flex-col justify-center items-center space-y-4 mt-14 p-2">
          <div className="border w-20 h-20 p-4 rounded-full flex  items-center justify-center">
            <Contact2Icon size={40} strokeWidth={1} />
          </div>
          <h1 className="text-2xl font-bold">Photos of you</h1>
          <p>When people tag you in photos, they &apos; ll appear here.</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-3 gap-1 mb-14">
          {postsData &&
            postsData.length > 0 &&
            postsData.map((post, index) => (
              <Link
                href={`/p/${post?.id}`}
                key={index}
                className="relative group"
              >
                <Image
                  src={post?.post?.image ? post?.post?.image.url : ""}
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

export default TaggedPosts;
