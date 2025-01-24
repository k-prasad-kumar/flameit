import LoginSkeleton from "@/components/skeletons/login-skeleton";

const page = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] max-w-screen-sm mx-auto my-6">
      <div className="px-4 lg:px-14 pt-0 md:pt-6 flex justify-center items-center w-full h-full">
        <LoginSkeleton />
      </div>
    </div>
  );
};
export default page;
