import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import { EllipsisIcon, MessageCircle, SendIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { PostResponseInterface, SavedInfo, UserInfo } from "@/types/types";
import LikePost from "@/components/post/like-post";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Saved from "./saved";

const PostPage = async ({
  post,
  user,
  saved,
}: {
  post: PostResponseInterface;
  user: UserInfo;
  saved: SavedInfo[];
}) => {
  return (
    <div className="w-full pb-4 md:pb-5" key={post?.id}>
      <div className="w-full py-2 md:py-3 px-3 md:px-0 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <ProfileAvatar
            image={post?.user?.image as string}
            alt="profile"
            width="10"
            height="10"
          />
          <h2 className="">{post?.user?.username}</h2>
        </div>
        <EllipsisIcon />
      </div>
      <Carousel
        className={` w-full h-full max-w-full ${
          post.images.length > 0 ? "flex" : "hidden"
        } justify-center shadow items-center relative border`}
      >
        <CarouselContent>
          {post?.images?.length > 0 &&
            post?.images?.map((image: { url: string; public_id: string }) => (
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
            ))}
        </CarouselContent>
        {post?.images?.length > 1 && (
          <>
            <CarouselPrevious className="hidden md:flex absolute bottom-[50%] left-3" />
            <CarouselNext className="hidden md:flex absolute bottom-[50%] right-2" />
          </>
        )}
      </Carousel>
      <div className="flex items-center justify-between space-x-5 my-3 px-3 md:px-0">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1">
            <LikePost postId={post?.id} user={user} likes={post?.likes} />
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle strokeWidth={1.5} size={26} />
          </div>
          <div className="flex items-center space-x-1">
            <SendIcon strokeWidth={1.5} size={26} />
          </div>
        </div>
        <div className="cursor-pointer">
          <Saved
            userId={user?.userId as string}
            postId={post?.id}
            image={post?.images[0].url as string}
            save={saved}
          />
        </div>
      </div>
      <div className="cursor-pointer">
        <Dialog>
          <DialogTrigger asChild>
            <p className="px-3 md:px-0">{post?.likesCount} likes</p>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Likes</DialogTitle>
            </DialogHeader>
            {post?.likes?.map((like) => (
              <div
                className="flex items-center justify-between"
                key={like.userId}
              >
                <div className="flex items-center space-x-3 max-w-4/6">
                  <ProfileAvatar
                    image={like.image as string}
                    alt="profile"
                    width="10"
                    height="10"
                  />
                  <p className="truncate max-w-[180px] sm:max-w-[280px]">
                    {like.username}
                  </p>
                </div>
                <Button variant={"blue"} className="ml-4 w-2/6">
                  Follow
                </Button>
                <Button variant={"secondary"} className="hidden">
                  Following
                </Button>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </div>
      {post?.caption && (
        <div className="flex px-3 md:px-0">
          <div
            className={post?.caption?.length > 57 ? "hidden" : "flex items-end"}
          >
            <span className="text-sm font-semibold pr-2">
              {post?.user?.username}
            </span>{" "}
            <span className="truncate">{post?.caption}</span>
          </div>
          <Accordion
            type="single"
            collapsible
            className={post?.caption?.length > 57 ? "flex w-full" : "hidden"}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex justify-normal items-end truncate">
                <span className="text-sm font-semibold pr-2">
                  {post?.user?.username}
                </span>{" "}
                <span className="truncate">{post?.caption}</span>
                <span className="text-gray-500">more</span>
              </AccordionTrigger>
              <AccordionContent>{post?.caption.slice(57)}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      <div className="px-3 md:px-0">
        <p className="cursor-pointer my-2 opacity-60">View all 89 comments</p>
      </div>
      <div className="px-3 md:px-0">
        <p className="text-sm">{post?.createdAt.toDateString()}</p>
      </div>
    </div>
  );
};
export default PostPage;
