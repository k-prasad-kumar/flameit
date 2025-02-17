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
import { PostResponseInterface } from "@/types/types";
import { Suspense } from "react";
import PostSkeleton from "../skeletons/post-skeleton";
import UserPostOptions from "./post-options";
import dynamic from "next/dynamic";

const DynamicPostInfo = dynamic(() => import("./post-info"));

const PostsCard = ({
  post,
  userId,
  username,
}: {
  post: PostResponseInterface;
  userId: string;
  username: string;
}) => {
  return (
    <>
      <Suspense fallback={<PostSkeleton />}>
        <div className="sm:mx-24 md:mx-20 lg:mx-10">
          <div className="w-full pb-4 md:pb-5" key={post?.id}>
            <div className="w-full py-2 md:py-3 px-3 md:px-0 flex justify-between items-center">
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
                  <h2 className="font-[500] text-sm">{post?.user?.username}</h2>
                </div>
              </Link>
              <UserPostOptions
                userId={userId}
                postUserId={post?.user?.id as string}
                postId={post?.id}
                isLikes={post?.isLikesCountHide}
                isComments={post?.isCommentsOff}
              />
            </div>
            <Carousel
              className={`w-full h-full max-w-full ${
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
                            src={image.url}
                            width={100}
                            height={100}
                            sizes="100%"
                            loading="lazy"
                            className="w-full h-[544px] object-cover"
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
              postUserId={post?.user?.id as string}
              userId={userId}
              username={username as string}
              postUsername={post?.user?.username as string}
              postId={post?.id as string}
              image={post?.images[0].url as string}
              comments={post?.comments}
              commentsCount={post?.commentsCount as number}
              likes={post?.likes}
              likesCount={post?.likesCount as number}
              savedBy={post?.savedBy}
              isLikes={post?.isLikesCountHide}
              isComments={post?.isCommentsOff}
            />

            <p className="opacity-60 text-xs mt-2 px-3 md:px-0">
              {getRelativeTime(post?.createdAt)}
            </p>
            <Separator className="mt-10 mb-4" />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default PostsCard;
