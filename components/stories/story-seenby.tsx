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
import { EyeIcon } from "lucide-react";
import { formatLikes } from "@/lib/format-likes-count";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { ProfileAvatar } from "../avatar";
import { StorySeenByInterface } from "@/types/types";

const StorySeenBy = ({ seenBy }: { seenBy: StorySeenByInterface[] }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <p className="cursor-pointer flex items-center gap-1">
              <EyeIcon
                strokeWidth={1.5}
                size={30}
                aria-description="like story"
              />
              <span className="text-lg">{formatLikes(seenBy.length)}</span>
            </p>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-center w-full">
                Viewed by {seenBy.length}
              </DialogTitle>
            </DialogHeader>
            <Separator />
            <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
              {seenBy.length === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                  <p className="text-center text-xl pb-2 font-semibold font-sans">
                    No one seen yet
                  </p>
                  <p className="text-sm">When someone see, it will show here</p>
                </div>
              )}
              {seenBy.length > 0 &&
                seenBy?.map((seen) => (
                  <div
                    className="flex items-center justify-between mb-5"
                    key={seen.id}
                  >
                    <div className="flex items-center space-x-3 max-w-4/6">
                      <Link href={`/${seen?.user?.username}`}>
                        <ProfileAvatar
                          image={seen?.user?.image as string}
                          alt="profile"
                          width="10"
                          height="10"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          href={`/${seen?.user?.username}`}
                          className="truncate max-w-[180px] sm:max-w-[280px]"
                        >
                          {seen?.user?.username}
                        </Link>
                        <p className="truncate max-w-[180px] sm:max-w-[280px] text-xs opacity-65">
                          {seen?.user?.name}
                        </p>
                      </div>
                    </div>
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
              <EyeIcon
                strokeWidth={1.5}
                size={30}
                aria-description="like story"
              />
              <span className="text-lg">{formatLikes(seenBy.length)}</span>
            </p>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] min-h-[80vh] px-4">
            <DrawerTitle>
              <p className="text-center mt-6 mb-2">Viewed by {seenBy.length}</p>
            </DrawerTitle>
            <Separator />
            <ScrollArea className="w-full h-[50vh] max-h-[50vh] md:h-[50vh] md:max-h-[50vh] py-2">
              {seenBy.length === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-[70vh] max-h-[70vh] md:h-[70vh] md:max-h-[65vh]">
                  <p className="text-center text-xl pb-2 font-semibold font-sans">
                    No one seen yet
                  </p>
                  <p className="text-sm">When someone see, it will show here</p>
                </div>
              )}
              {seenBy.length > 0 &&
                seenBy?.map((seen) => (
                  <div
                    className="flex items-center justify-between mb-5"
                    key={seen.id}
                  >
                    <div className="flex items-center space-x-3 max-w-4/6">
                      <Link href={`/${seen?.user?.username}`}>
                        <ProfileAvatar
                          image={seen?.user?.image as string}
                          alt="profile"
                          width="10"
                          height="10"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          href={`/${seen?.user?.username}`}
                          className="truncate max-w-[180px] sm:max-w-[280px]"
                        >
                          {seen?.user?.username}
                        </Link>
                        <p className="truncate max-w-[180px] sm:max-w-[280px] text-xs opacity-65">
                          {seen?.user?.name}
                        </p>
                      </div>
                    </div>
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
export default StorySeenBy;
