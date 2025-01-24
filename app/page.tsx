import { Suspense } from "react";
import Loading from "@/app/loading";
import Footer from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import { getPosts } from "@/lib/actions/post.actions";
import PostsCard from "@/components/post/post";
import { PostResponseInterface } from "@/types/types";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const posts: PostResponseInterface[] | undefined = await getPosts();
  if (!posts) {
    // handle the case where posts is undefined
    return <div>No posts found</div>;
  }
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
          <PostsCard posts={posts!} userId={user?.id as string} />
        </div>
        <div className="w-full flex justify-center items-center mt-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
}
