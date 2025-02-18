import { Skeleton } from "../ui/skeleton";

const StoriesSkeleton = () => {
  return (
    <div className="w-full h-screen relative z-50 bg-background">
      <div className="absolute top-0 left-0 w-full bg-background p-4 flex justify-between">
        <Skeleton className="w-24 h-4"></Skeleton>
        <Skeleton className="w-5 h-5"></Skeleton>
      </div>
      <div className="w-full h-full max-w-screen-sm absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 mx-auto bg-background">
        <div className="w-full h-full sm:px-16 md:px-14">
          <div className="w-full h-full flex justify-center items-center">
            <Skeleton className="w-full h-full flex justify-center">
              <div className="flex flex-col justify-between w-full px-4">
                <div className="flex justify-between items-center w-full mt-5">
                  <div className="flex gap-2 items-center">
                    <Skeleton className="w-10 h-4"></Skeleton>
                    <Skeleton className="w-14 h-14 rounded-full"></Skeleton>
                    <div className="flex flex-col gap-1">
                      <Skeleton className="w-20 h-3"></Skeleton>
                      <Skeleton className="w-20 h-3"></Skeleton>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8"></Skeleton>
                    <Skeleton className="w-8 h-8"></Skeleton>
                  </div>
                </div>
                <div className="flex gap-2 mb-5">
                  <Skeleton className="w-5/6 h-10"></Skeleton>
                  <Skeleton className="w-1/6 h-10"></Skeleton>
                </div>
              </div>
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoriesSkeleton;
