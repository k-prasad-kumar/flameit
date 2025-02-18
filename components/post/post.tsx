"use client";

import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { getRelativeTime } from "@/lib/relative-time";
import { useEffect, useState, useRef, useCallback } from "react";
import { getFollowingPosts } from "@/lib/actions/post.actions";
import { PostResponseInterface } from "@/types/types";
import dynamic from "next/dynamic";
import TruncateCaption from "./caption-truncate";

const DynamicPostOptions = dynamic(() => import("./post-options"));
const DynamicPostInfo = dynamic(() => import("./post-info"));

const PostsCard = ({
  posts,
  userId,
  username,
  followingIds,
}: {
  posts: PostResponseInterface[];
  userId: string;
  username: string;
  followingIds: string[];
}) => {
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState<PostResponseInterface[]>(posts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Function to load more posts.
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newPosts: PostResponseInterface[] | undefined =
        await getFollowingPosts(followingIds, page * 5, 5);
      if (newPosts && newPosts.length > 0) {
        setPostsData((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, followingIds]);

  // Use Intersection Observer to load more data when the sentinel is visible.
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the sentinel is visible.
    );
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }
    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, loading, loadMoreData]);

  return (
    <div className="sm:mx-24 md:mx-20 lg:mx-12">
      {postsData.length > 0 &&
        postsData.map((post, idx) => (
          <div className="w-full mb-8 md:mb-0" key={idx}>
            <div className="w-full pb-2 px-3 md:px-0 flex justify-between items-center">
              <Link
                href={`/${post?.user?.username}`}
                className="flex items-center space-x-3"
              >
                <ProfileAvatar
                  image={post?.user?.image as string}
                  alt="profile"
                  width="10"
                  height="10"
                />
                <div className="flex flex-col">
                  <h2 className="font-[500]">{post?.user?.username}</h2>
                </div>
              </Link>
              <DynamicPostOptions
                userId={userId}
                postUserId={post?.user?.id as string}
                postId={post?.id}
                isLikes={post?.isLikesCountHide}
                isComments={post?.isCommentsOff}
              />
            </div>
            <div
              className={`w-full h-full max-w-full justify-center shadow items-center relative border`}
            >
              <div className="flex aspect-square items-center justify-center">
                <Image
                  src={post?.image.url as string}
                  width={100}
                  height={100}
                  sizes="100%"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                  alt="post"
                />
              </div>
            </div>
            <DynamicPostInfo
              postUserId={post?.user?.id as string}
              userId={userId}
              username={username as string}
              postUsername={post?.user?.username as string}
              postId={post?.id as string}
              image={post?.image.url as string}
              comments={post?.comments}
              commentsCount={post?.commentsCount as number}
              likes={post?.likes}
              likesCount={post?.likesCount as number}
              savedBy={post?.savedBy}
              isLikes={post?.isLikesCountHide}
              isComments={post?.isCommentsOff}
            />
            {post?.caption && (
              <div className="px-3 md:px-0 text-sm">
                <TruncateCaption
                  username={post?.user?.username as string}
                  text={post?.caption as string}
                />
              </div>
            )}
            <p className="opacity-60 text-xs px-3 md:px-0 mt-1">
              {getRelativeTime(post?.createdAt)}
            </p>
            <Separator className="my-5 hidden md:flex" />
          </div>
        ))}
      {/* Sentinel element for Intersection Observer */}
      <div ref={sentinelRef} />
      {loading && (
        <div className="w-full flex justify-center items-center mt-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
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

export default PostsCard;
