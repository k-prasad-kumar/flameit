"use client";

import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { getRelativeTime } from "@/lib/relative-time";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/actions/post.actions";
import { PostResponseInterface } from "@/types/types";
// import PostOptions from "./post-options";
// import PostInfo from "./post-info";

import dynamic from "next/dynamic";

const DynamicPostOptions = dynamic(() => import("./post-options"));
const DynamicPostInfo = dynamic(() => import("./post-info"));

const PostsCard = ({
  posts,
  userId,
  username,
}: {
  posts: PostResponseInterface[];
  userId: string;
  username: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState(posts);
  const [page, setPage] = useState(1);

  const loadMoreData = async () => {
    setLoading(true);

    const posts: PostResponseInterface[] | undefined = await getPosts(
      page * 5,
      5
    );
    setPostsData([...postsData, ...posts!]);
    setPage(page + 1);
    setLoading(false);
  };
  const onScroll = async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      await loadMoreData();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, page]);
  return (
    <div>
      {postsData.length > 0 &&
        postsData.map((post) => (
          <div className="w-full" key={post?.id}>
            <div className="w-full py-2 px-3 md:px-0 flex justify-between items-center">
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
                  <h2 className="font-semibold">{post?.user?.username}</h2>
                </div>
              </Link>
              <DynamicPostOptions
                userId={userId}
                postUserId={post?.user?.id as string}
                postId={post?.id}
              />
            </div>
            <Carousel
              className={` w-full h-full max-w-full ${
                post.images.length > 0 ? "flex" : "hidden"
              } justify-center shadow items-center relative border`}
            >
              <CarouselContent>
                {post?.images?.length > 0 &&
                  post?.images?.map(
                    (image: { url: string; public_id: string }) => (
                      <CarouselItem key={image.public_id}>
                        <div className="flex aspect-square items-center justify-center">
                          <Image
                            src={`${image.url}`}
                            width={100}
                            height={100}
                            sizes="100%"
                            loading="lazy"
                            className="w-full h-[500px] md:h-[640px] object-cover"
                            alt="post"
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
              </CarouselContent>
              {post?.images?.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex absolute bottom-[50%] left-3" />
                  <CarouselNext className="hidden md:flex absolute bottom-[50%] right-2" />
                </>
              )}
            </Carousel>
            <DynamicPostInfo
              post={post}
              userId={userId}
              username={username as string}
            />
            <p className="opacity-60 text-xs mt-2 px-3 md:px-0">
              {getRelativeTime(post?.createdAt)}
            </p>
            <Separator className="my-5" />
          </div>
        ))}
      {loading && (
        <div className="w-full flex justify-center items-center mt-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
};
export default PostsCard;
