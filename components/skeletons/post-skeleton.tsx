import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="w-full max-w-screen-sm mx-auto pb-4 md:pb-5 mt-16 md:mt-14 md:px-4 lg:px-14">
      <div className="w-full py-2 md:py-3 px-3 md:px-0 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
          <Skeleton className="w-28 h-4"></Skeleton>
        </div>
        <div className="flex gap-1 items-center px-2">
          <Skeleton className="w-1 h-1 rounded-full"></Skeleton>
          <Skeleton className="w-1 h-1 rounded-full"></Skeleton>
          <Skeleton className="w-1 h-1 rounded-full"></Skeleton>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Skeleton className="w-full h-[400px] md:w-full md:h-[500px]"></Skeleton>
      </div>
      <div className="flex items-center justify-between space-x-4 my-3 px-3 md:px-0">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1">
            <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
            <Skeleton className="w-8 h-3 rounded-full"></Skeleton>
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
            <Skeleton className="w-8 h-3 rounded-full"></Skeleton>
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
            <Skeleton className="w-8 h-3 rounded-full"></Skeleton>
          </div>
        </div>
        <Skeleton className="w-6 h-6 rounded-full"></Skeleton>
      </div>
      <div className="flex px-3 md:px-0 space-x-2">
        <Skeleton className="w-40 h-4 rounded-md"></Skeleton>
        <Skeleton className="w-full h-4 rounded-md"></Skeleton>
      </div>
      <div className="px-3 md:px-0 my-4">
        <Skeleton className="w-40 h-4 rounded-md"></Skeleton>
      </div>
      <div className="w-full py-4 md:py-3 px-3 md:px-0 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
          <Skeleton className="w-24 h-4"></Skeleton>
        </div>
        <div className="flex gap-1 items-center px-2">
          <Skeleton className="w-1 h-1 rounded-full"></Skeleton>
          <Skeleton className="w-1 h-1 rounded-full"></Skeleton>
          <Skeleton className="w-1 h-1 rounded-full"></Skeleton>
        </div>
      </div>
      <div className="w-full flex justify-center shadow">
        <Skeleton className="w-full h-[400px] md:w-full md:h-[500px] animate-pulse"></Skeleton>
      </div>
    </div>
  );
};
export default PostSkeleton;
