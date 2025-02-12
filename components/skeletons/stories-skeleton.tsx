import { Skeleton } from "../ui/skeleton";

const StoriesSkeleton = () => {
  return (
    <div className="w-full h-screen relative z-50 bg-background">
      <div className="absolute top-0 left-0 w-full bg-background p-4 flex justify-between">
        <Skeleton className="w-24 h-4"></Skeleton>
        <Skeleton className="w-5 h-5"></Skeleton>
      </div>
      <div className="w-full h-full max-w-screen-sm absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 mx-auto bg-background">
        <div className="w-full h-full sm:px-16 md:px-24">
          <div className="w-full h-full flex justify-center items-center">
            <Skeleton className="w-full h-full flex justify-center"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoriesSkeleton;
