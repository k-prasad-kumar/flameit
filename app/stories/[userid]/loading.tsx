import StoriesSkeleton from "@/components/skeletons/stories-skeleton";

const Loading = () => {
  return (
    <div className="w-full h-screen max-w-screen mx-auto">
      <div className="w-full h-full flex items-center justify-center">
        <StoriesSkeleton />
      </div>
    </div>
  );
};
export default Loading;
