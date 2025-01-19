import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import {
  BookmarkIcon,
  EllipsisIcon,
  MessageCircle,
  SendIcon,
} from "lucide-react";
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
import { PostsInterface } from "@/types/types";
import PostLike from "./post-like";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

const PostsCard = async ({ posts }: { posts: PostsInterface[] }) => {
  return (
    <div>
      {posts.length > 0 &&
        posts.map((post) => (
          <div className="w-full pb-4 md:pb-5" key={post.id}>
            <div className="w-full py-2 md:py-3 px-3 md:px-0 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <ProfileAvatar
                  image={post.userImage}
                  alt="profile"
                  width="10"
                  height="10"
                />
                <h2 className="">{post.username}</h2>
              </div>
              <EllipsisIcon />
            </div>
            <Carousel
              className={` w-full h-full max-w-full ${
                post.images.length > 0 ? "flex" : "hidden"
              } justify-center shadow items-center relative border`}
            >
              <CarouselContent>
                {post.images.length > 0 &&
                  post.images?.map((image) => (
                    <CarouselItem key={image.uuid}>
                      <div className="flex aspect-square items-center justify-center">
                        <Image
                          src={`${image.cdnUrl}`}
                          width={100}
                          height={100}
                          sizes="100%"
                          loading="lazy"
                          className="w-full h-auto object-cover"
                          alt="post"
                        />
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              {post.images.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex absolute bottom-[50%] left-3" />
                  <CarouselNext className="hidden md:flex absolute bottom-[50%] right-2" />
                </>
              )}
            </Carousel>
            <div className="flex items-center justify-between space-x-5 my-3 px-3 md:px-0">
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-1">
                  <PostLike
                    likes={post.likes}
                    userId={user!.id!}
                    postId={post.id}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle strokeWidth={1.5} size={26} />
                </div>
                <div className="flex items-center space-x-1">
                  <SendIcon strokeWidth={1.5} size={26} />
                </div>
              </div>
              <BookmarkIcon strokeWidth={1.5} size={26} />
            </div>
            <div className="cursor-pointer">
              <Dialog>
                <DialogTrigger asChild>
                  <p className="px-3 md:px-0">{post.likes.length} likes</p>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Likes</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex px-3 md:px-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="flex justify-normal truncate">
                    <span className="text-sm font-semibold pr-2">
                      {post.username}
                    </span>{" "}
                    <span className="truncate">{post.caption}</span>
                    <span className="text-gray-500">more</span>
                  </AccordionTrigger>
                  <AccordionContent>{post.caption.slice(57)}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="px-3 md:px-0">
              <p className="text-sm">{post.createdAt.toDateString()}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default PostsCard;
