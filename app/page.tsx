import { Suspense } from "react";
import Loading from "@/app/loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import { PostResponseInterface } from "@/types/types";
import { getPosts } from "@/lib/actions/post.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CameraIcon } from "lucide-react";
import PostsCard from "@/components/post/post";
import Footer from "@/components/layout/footer";
import Head from "next/head";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (!user?.username) return null;

  const posts: PostResponseInterface[] | undefined = await getPosts(0, 5);

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full min-h-screen max-w-screen-sm mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="border-2 rounded-full">
            <CameraIcon strokeWidth={1} className="w-20 h-20 m-5" />
          </div>
          <h2 className="text-2xl">No Posts Yet</h2>
          <Link href={`/create-post`}>
            <Button>Create Post</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FlameIt</title>
        <meta name="description" content={"A place to share your thoughts"} />

        {/* Open Graph tags */}
        <meta property="og:title" content={"FlameIt"} />
        <meta
          property="og:description"
          content={"A place to share your thoughts"}
        />
        <meta
          property="og:image"
          content={
            "https://res.cloudinary.com/flameit/image/upload/v1739108958/FlameIt_nykv2i.png"
          }
        />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FlameIt" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={"FlameIt"} />
        <meta
          name="twitter:description"
          content={"A place to share your thoughts"}
        />
        <meta
          name="twitter:image"
          content={
            "https://res.cloudinary.com/flameit/image/upload/v1739108958/FlameIt_nykv2i.png"
          }
        />
      </Head>

      <Suspense fallback={<Loading />}>
        <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
          <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-5">
            <PostsCard
              posts={posts!}
              userId={user?.id as string}
              username={user?.username as string}
            />
          </div>
          <Footer />
        </div>
      </Suspense>
    </>
  );
}
