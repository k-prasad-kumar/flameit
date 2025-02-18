import { getCurrentUser } from "@/lib/current-user-data";
import Loading from "@/app/stories/[userid]/loading";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import StoriesPage from "@/components/stories/stories-page";
import { FollowingInterface, StoriesResponseInterface } from "@/types/types";
import { addSeenBy, getFollowingStories } from "@/lib/actions/stories.actions";
import { getFollowing } from "@/lib/actions/user.actions";

const page = async ({ params }: { params: Promise<{ userid: string }> }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = (await params).userid;

  const following: FollowingInterface[] = await getFollowing(user.id);

  const followingIds = following.map((f) => f.followingId);
  followingIds.push(user.id);

  const stories: StoriesResponseInterface[] | undefined =
    await getFollowingStories(followingIds);

  if (stories?.length === 0) redirect("/");

  const userStories = stories?.filter((story) => story.user.id === userId);

  if (user?.id !== userId) {
    userStories?.forEach((story) => {
      addSeenBy(user?.id, story.id).then((data) => {
        if (data?.success) return;
      });
    });
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen max-w-screen mx-auto">
        <div className="w-full h-full flex items-center justify-center">
          <StoriesPage
            loginUserId={user?.id as string}
            userId={userId as string}
            stories={stories!}
            userStories={userStories!}
          />
        </div>
      </div>
    </Suspense>
  );
};
export default page;
