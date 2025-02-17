import { Suspense } from "react";
import Loading from "@/app/loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import {
  FollowingInterface,
  PostResponseInterface,
  StoryUserInfoInterface,
  UserInfo,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CameraIcon } from "lucide-react";
import PostsCard from "@/components/post/post";
import Footer from "@/components/layout/footer";
import Stories from "@/components/stories/stories";
import { getFollowingPosts } from "@/lib/actions/post.actions";
import { getFollowingStoriesUserInfo } from "@/lib/actions/stories.actions";
import { getFollowing } from "@/lib/actions/user.actions";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (!user?.username) return null;

  const following: FollowingInterface[] = await getFollowing(user.id);

  const followingIds = following.map((f) => f.followingId);
  followingIds.push(user.id);

  const stories: StoryUserInfoInterface[] | undefined =
    await getFollowingStoriesUserInfo(followingIds);

  const uniqueUsers: UserInfo[] = Array.from(
    new Map(stories?.map((story) => [story.user.id, story.user])).values()
  );

  const posts: PostResponseInterface[] | undefined = await getFollowingPosts(
    followingIds,
    0,
    5
  );

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full min-h-screen max-w-screen-sm mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="border-2 rounded-full mb-2">
            <CameraIcon strokeWidth={1} className="w-20 h-20 m-5" />
          </div>
          <h2 className="text-2xl">No posts yet</h2>
          <p className="text-sm">Follow people to see their posts</p>
          <Link href={`/create-post`}>
            <Button className="mt-5">Create Post</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-5">
          <Stories userImage={user?.image as string} stories={uniqueUsers!} />
          <PostsCard
            posts={posts!}
            userId={user?.id as string}
            username={user?.username as string}
            followingIds={followingIds}
          />
        </div>
        <Footer />
      </div>
    </Suspense>
  );
}
