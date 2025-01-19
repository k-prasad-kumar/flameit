import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

const ChatSkeleton = () => {
  return (
    <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 flex flex-col items-between mx-4 md:mx-0">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center space-x-5">
            <Skeleton className="w-12 h-6 rounded-full"> </Skeleton>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-full"> </Skeleton>
              <div className="flex flex-col gap-1">
                <Skeleton className="w-20 h-4"> </Skeleton>
                <Skeleton className="w-20 h-2"> </Skeleton>
              </div>
            </div>
          </div>
          <Skeleton className="w-10 h-10 rounded-full"> </Skeleton>
        </div>
        <ScrollArea className="w-full h-[75vh] max-h-[75vh] md:h-[80vh] md:max-h-[80vh] py-2">
          <div className="space-y-2 py-2 w-full h-full flex gap-2 flex-col">
            <div className="flex justify-center">
              <Skeleton className="justify-center w-20 h-4"></Skeleton>
            </div>
            <div className="flex space-x-2 w-1/2">
              <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
              <Skeleton className="px-5 py-2 rounded-xl w-3/4 h-10"></Skeleton>
            </div>
            <div className="space-x-2 w-full max-3/4 grid justify-items-stretch">
              <Skeleton className="px-5 py-2 w-1/2 h-10 justify-self-end"></Skeleton>
            </div>
            <div className="flex space-x-2 w-1/2">
              <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
              <Skeleton className="px-5 py-2 rounded-xl w-3/4 h-10"></Skeleton>
            </div>
            <div className="space-x-2 w-full max-3/4 grid justify-items-stretch">
              <Skeleton className="px-5 py-2 w-1/2 h-10 justify-self-end"></Skeleton>
            </div>
          </div>
          <div className="space-y-2 py-2 w-full h-full flex gap-2 flex-col mt-4">
            <div className="flex justify-center">
              <Skeleton className="justify-center w-20 h-4"></Skeleton>
            </div>
            <div className="flex space-x-2 w-1/2">
              <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
              <Skeleton className="px-5 py-2 rounded-xl w-3/4 h-10"></Skeleton>
            </div>
            <div className="space-x-2 w-full max-3/4 grid justify-items-stretch">
              <Skeleton className="px-5 py-2 w-1/2 h-10 justify-self-end"></Skeleton>
            </div>
            <div className="flex space-x-2 w-1/2">
              <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
              <Skeleton className="px-5 py-2 rounded-xl w-3/4 h-10"></Skeleton>
            </div>
            <div className="space-x-2 w-full max-3/4 grid justify-items-stretch">
              <Skeleton className="px-5 py-2 w-1/2 h-10 justify-self-end"></Skeleton>
            </div>
          </div>
        </ScrollArea>
        <div className="w-full flex items-center gap-2">
          <Skeleton className="w-full h-8"> </Skeleton>
          <Skeleton className="w-12 h-8"> </Skeleton>
        </div>
      </div>
    </div>
  );
};
export default ChatSkeleton;
