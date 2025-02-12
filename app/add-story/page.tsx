import { getCurrentUser } from "@/lib/current-user-data";
import Loading from "./loading";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AddStory from "@/components/stories/add-story";

const CreatePostPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 w-full h-full flex items-center justify-center">
          <AddStory userId={user?.id as string} />
        </div>
      </div>
    </Suspense>
  );
};
export default CreatePostPage;
