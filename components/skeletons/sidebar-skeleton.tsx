import { Skeleton } from "../ui/skeleton";

const SidebarSkeleton = () => {
  return (
    <div className="fixed left-1/2 bottom-0 -translate-x-1/2 md:left-9 md:top-1/2 md:-translate-y-1/2 px-3 flex md:flex-col justify-between md:justify-center items-center md:gap-5 w-full md:w-fit bg-white dark:bg-black border-t md:border-none z-50">
      <Skeleton className="w-10 h-10 py-2 px-3 rounded-full my-2 md:my-0"></Skeleton>
      <Skeleton className="w-10 h-10 py-2 px-3 rounded-full my-2 md:my-0"></Skeleton>
      <Skeleton className="w-10 h-10 py-2 px-3 rounded-full my-2 md:my-0"></Skeleton>
      <Skeleton className="w-10 h-10 py-2 px-3 rounded-full my-2 md:my-0"></Skeleton>
      <Skeleton className="w-10 h-10 py-2 px-3 rounded-full my-2 md:my-0"></Skeleton>
    </div>
  );
};
export default SidebarSkeleton;
