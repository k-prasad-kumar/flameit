import { Skeleton } from "../ui/skeleton";
import FollowerCardSkeleton from "./followercard-skeleton";

const SearchSkeleton = () => {
  return (
    <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
        <div className="mx-4 my-4">
          <Skeleton className="w-full h-8"></Skeleton>
        </div>
        <div className="flex flex-col mx-4">
          <Skeleton className="my-4 w-1/2 h-4"></Skeleton>
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
          <FollowerCardSkeleton />
        </div>
      </div>
    </div>
  );
};
export default SearchSkeleton;
