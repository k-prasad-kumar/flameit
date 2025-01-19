import { Skeleton } from "../ui/skeleton";

const FollowerCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between my-2">
      <div className="flex items-center space-x-4 h-fit">
        <Skeleton className="w-12 h-12 rounded-full"></Skeleton>
        <div className="space-y-1">
          <Skeleton className="w-28 h-4"></Skeleton>
          <Skeleton className="w-28 h-3"></Skeleton>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="w-24 h-10"></Skeleton>
        <Skeleton className="w-10 h-10"></Skeleton>
      </div>
    </div>
  );
};
export default FollowerCardSkeleton;
