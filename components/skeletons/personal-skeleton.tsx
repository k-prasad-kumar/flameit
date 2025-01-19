import { Skeleton } from "../ui/skeleton";

const PersonalEditSkeleton = () => {
  return (
    <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
      <div className="px-4 lg:px-14 pt-0 md:pt-6">
        <Skeleton className="my-4 w-44 h-10"></Skeleton>

        <div className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-32 h-5"></Skeleton>
            <Skeleton className="w-full h-24"></Skeleton>
          </div>
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-32 h-5"></Skeleton>
            <Skeleton className="w-full h-10"></Skeleton>
          </div>
          <Skeleton className="w-full h-10"></Skeleton>
        </div>
      </div>
    </div>
  );
};
export default PersonalEditSkeleton;
