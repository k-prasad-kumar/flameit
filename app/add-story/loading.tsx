import CreatePostSkeleton from "@/components/skeletons/create-post-skeleton";

const Loading = () => {
  return (
    <div className="w-full h-screen max-w-screen-sm mx-auto mt-16 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 w-full h-full flex items-center justify-center">
        <CreatePostSkeleton />
      </div>
    </div>
  );
};
export default Loading;
