import { getCurrentUser } from "@/lib/current-user-data";
import Loading from "@/app/stories/loading";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import StoriesPage from "@/components/stories/stories-page";
import { StroriesResponseInterface } from "@/types/types";
import { getStories } from "@/lib/actions/stories.actions";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stories: StroriesResponseInterface[] | undefined = await getStories();

  if (stories?.length === 0) redirect("/");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen max-w-screen mx-auto">
        <div className="w-full h-full flex items-center justify-center">
          <StoriesPage userId={user?.id as string} stories={stories!} />
        </div>
      </div>
    </Suspense>
  );
};
export default page;
