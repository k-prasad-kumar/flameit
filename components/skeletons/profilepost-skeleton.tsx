import ProfileCardSkeleton from "./profilecard-skeleton";
import { Skeleton } from "../ui/skeleton";

const ProfilePostsSkeleton = () => {
  return (
    <>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <ProfileCardSkeleton />
        <div className="w-full flex justify-center items-center space-x-10 md:space-x-20">
          <Skeleton className="py-2 px-2 flex items-center gap-2 w-20 h-8"></Skeleton>
          <Skeleton className="py-2 px-2 flex items-center gap-2 w-20 h-8"></Skeleton>
          <Skeleton className="py-2 px-2 flex items-center gap-2 w-20 h-8"></Skeleton>
        </div>
        <div className="w-full grid grid-cols-3 mt-5 px-4 md:px-2 gap-2">
          <Skeleton className="w-full h-[180px] md:h-[210px]"></Skeleton>
          <Skeleton className="w-full h-[180px] md:h-[210px]"></Skeleton>
          <Skeleton className="w-full h-[180px] md:h-[210px]"></Skeleton>
          <Skeleton className="w-full h-[180px] md:h-[210px]"></Skeleton>
          <Skeleton className="w-full h-[180px] md:h-[210px]"></Skeleton>
          <Skeleton className="w-full h-[180px] md:h-[210px]"></Skeleton>
        </div>
      </div>
    </>
  );
};
export default ProfilePostsSkeleton;
