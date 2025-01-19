import { Skeleton } from "../ui/skeleton";

const ProfileCardSkeleton = () => {
  return (
    <>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <div className="px-0 md:px-4 pt-0 md:pt-6">
          <div className="flex items-center justify-between md:justify-evenly space-x-8 md:space-x-14 w-full px-4 md:px-0">
            <div className="w-2/6 flex items-center justify-center">
              <Skeleton
                className={`max-w-20 max-h-20 w-20 h-20 md:max-w-36 md:max-h-36 md:w-36 md:h-36 rounded-full`}
              ></Skeleton>
            </div>
            <div className="flex flex-col justify-center w-4/6">
              <div className="flex space-x-2 md:space-x-2 py-4 w-full">
                <Skeleton className="w-14 md:w-14 h-6"></Skeleton>
                <Skeleton className="w-20 md:w-28 h-6"></Skeleton>
                <Skeleton className="w-20 md:w-28 h-6"></Skeleton>
              </div>
              <div className="hidden md:flex flex-col w-full px-4 md:px-0">
                <Skeleton className="w-20 h-4 my-1"></Skeleton>
                <Skeleton className="w-24 h-4 my-2"></Skeleton>
                <Skeleton className="w-full h-4"></Skeleton>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full px-4 md:px-0 md:hidden">
            <Skeleton className="w-40 h-4 my-2"></Skeleton>
            <Skeleton className="w-40 h-4 my-2"></Skeleton>
            <Skeleton className="w-full h-4"></Skeleton>
          </div>
          <div className="w-full my-8 md:mx-0 flex justify-around gap-4">
            <Skeleton className="w-full h-10 ml-4 md:ml-0"></Skeleton>
            <Skeleton className="w-full h-10 mr-4 md:mr-0"></Skeleton>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileCardSkeleton;
