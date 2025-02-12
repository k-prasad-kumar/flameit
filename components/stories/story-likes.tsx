import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HeartIcon } from "lucide-react";
import { formatLikes } from "@/lib/format-likes-count";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { ProfileAvatar } from "../avatar";
import { StoryLike } from "@/types/types";

const StoryLikes = ({ likes }: { likes: StoryLike[] }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <p className="cursor-pointer flex items-center gap-1">
              <HeartIcon
                strokeWidth={1.5}
                size={30}
                aria-description="like story"
              />
              <span className="text-lg">{formatLikes(likes.length)}</span>
            </p>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-center w-full">
                Likes
              </DialogTitle>
            </DialogHeader>
            <Separator />
            <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
              {likes.length === 0 && (
                <div className="flex items-center justify-center w-full min-h-full">
                  <p>When someone likes the story it will appeare here</p>
                </div>
              )}
              {likes.length > 0 &&
                likes?.map((like) => (
                  <div
                    className="flex items-center justify-between mb-5"
                    key={like.id}
                  >
                    <div className="flex items-center space-x-3 max-w-4/6">
                      <Link href={`/${like?.user?.username}`}>
                        <ProfileAvatar
                          image={like?.user?.image as string}
                          alt="profile"
                          width="10"
                          height="10"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          href={`/${like?.user?.username}`}
                          className="truncate max-w-[180px] sm:max-w-[280px]"
                        >
                          {like?.user?.username}
                        </Link>
                        <p className="truncate max-w-[180px] sm:max-w-[280px] text-xs opacity-65">
                          {like?.user?.name}
                        </p>
                      </div>
                    </div>
                    <HeartIcon
                      strokeWidth={0}
                      size={30}
                      fill="red"
                      aria-description="like story"
                    />
                  </div>
                ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex md:hidden">
        <Drawer>
          <DrawerTrigger>
            <p className="cursor-pointer flex items-center gap-1">
              <HeartIcon
                strokeWidth={1.5}
                size={30}
                aria-description="like story"
              />
              <span className="text-lg">{formatLikes(likes.length)}</span>
            </p>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] min-h-[80vh] px-4">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Likes</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
              {likes.length === 0 && (
                <div className="flex items-center justify-center w-full min-h-full">
                  <p>When someone likes the story it will appeare here</p>
                </div>
              )}
              {likes.length > 0 &&
                likes?.map((like) => (
                  <div
                    className="flex items-center justify-between mb-5"
                    key={like.id}
                  >
                    <div className="flex items-center space-x-3 max-w-4/6">
                      <Link href={`/${like?.user?.username}`}>
                        <ProfileAvatar
                          image={like?.user?.image as string}
                          alt="profile"
                          width="10"
                          height="10"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          href={`/${like?.user?.username}`}
                          className="truncate max-w-[180px] sm:max-w-[280px]"
                        >
                          {like?.user?.username}
                        </Link>
                        <p className="truncate max-w-[180px] sm:max-w-[280px] text-xs opacity-65">
                          {like?.user?.name}
                        </p>
                      </div>
                    </div>
                    <HeartIcon
                      strokeWidth={0}
                      size={30}
                      fill="red"
                      aria-description="like story"
                    />
                  </div>
                ))}
            </ScrollArea>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
export default StoryLikes;
