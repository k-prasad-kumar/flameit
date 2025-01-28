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
import PostInfo from "./post-info";
import { PostResponseInterface } from "@/types/types";
import { Suspense } from "react";
import PostSkeleton from "../skeletons/post-skeleton";
import UserPostOptions from "./user-post-options";

const PostsCard = async ({
  post,
  userId,
}: {
  post: PostResponseInterface;
  userId: string;
}) => {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <div>
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
                <h2 className="font-semibold">{post?.user?.username}</h2>
              </div>
            </Link>
            <UserPostOptions
              userId={userId}
              postUserId={post?.user?.id as string}
              username={post?.user?.username as string}
              image={post?.user?.image as string}
              postId={post?.id}
              postImage={post?.images[0]?.url as string}
              caption={post?.caption as string}
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
                          className="w-auto h-[550px] object-cover"
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
          <PostInfo post={post} userId={userId} />
          <p className="opacity-60 text-xs mt-2 px-3 md:px-0">
            {getRelativeTime(post?.createdAt)}
          </p>
          <Separator className="mt-10 mb-4" />
        </div>
      </div>
    </Suspense>
  );
};

export default PostsCard;
