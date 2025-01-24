import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import EditProfile from "@/components/profile/edit-profile";
import { EditProfileInterface } from "@/types/types";
import Logout from "@/components/auth/logout";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const editProfile: EditProfileInterface = {
    name: user?.name as string,
    username: user?.username as string,
    bio: user?.bio as string,
    gender: user?.gender as string,
  };
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10 mb-20">
        <div className="px-4 lg:px-14 pt-0 md:pt-6">
          <h1 className="text-4xl my-4">Edit Profile</h1>
          <EditProfile
            userId={user?.id as string}
            changeImage={{
              image: user?.image as string,
              imagePublicId: user?.imagePublicId as string,
            }}
            editProfile={editProfile}
            hasPassword={user?.password ? true : false}
          />
          <div className="w-full my-4">
            <Logout />
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default page;
