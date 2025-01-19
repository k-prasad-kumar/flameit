import { Skeleton } from "../ui/skeleton";

const EditProfileSkeleton = () => {
  return (
    <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
      <div className="px-4 lg:px-14 pt-0 md:pt-6">
        <Skeleton className="w-44 h-10 my-4"></Skeleton>
        <div className="flex flex-col space-y-5">
          <Skeleton className="w-28 h-4"></Skeleton>
          <div className="flex items-center justify-between">
            <span className="flex gap-4 items-center">
              <Skeleton className="rounded-full w-12 h-12"></Skeleton>
              <Skeleton className="w-32 h-6"></Skeleton>
            </span>
            <span>
              <Skeleton className="w-4 h-6"></Skeleton>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex gap-4 items-center">
              <Skeleton className="rounded-full w-12 h-12"></Skeleton>
              <Skeleton className="w-32 h-6"></Skeleton>
            </span>
            <span>
              <Skeleton className="w-4 h-6"></Skeleton>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex gap-4 items-center">
              <Skeleton className="rounded-full w-12 h-12"></Skeleton>
              <Skeleton className="w-32 h-6"></Skeleton>
            </span>
            <span>
              <Skeleton className="w-4 h-6"></Skeleton>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfileSkeleton;
