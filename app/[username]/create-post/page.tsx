import CreatePost from "@/components/post/create-post";
import { getCurrentUser } from "@/lib/current-user-data";

const CreatePostPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="w-full h-screen max-w-screen-sm mx-auto mt-16 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 w-full h-full flex items-center justify-center">
        <CreatePost
          userId={user?.id as string}
          username={user?.username as string}
          image={user?.image as string}
        />
      </div>
    </div>
  );
};
export default CreatePostPage;
