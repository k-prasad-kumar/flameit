import { Skeleton } from "@/components/ui/skeleton";

const HeaderSkeleton = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full bg-white dark:bg-inherit z-50">
        <header className="flex justify-between items-center h-14 px-3 md:px-4 lg:px-5 realtive">
          <Skeleton className="flex items-center space-x-1 w-28 h-8"></Skeleton>
          <Skeleton className="flex items-center space-x-2 w-10 h-10"></Skeleton>
        </header>
      </div>
    </div>
  );
};
export default HeaderSkeleton;
