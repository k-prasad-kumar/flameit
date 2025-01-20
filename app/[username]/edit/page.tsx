// import {
//   ChevronRightIcon,
//   HomeIcon,
//   LogOutIcon,
//   UserRoundPenIcon,
// } from "lucide-react";
// import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser, getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

const EditProfile = async () => {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getCurrentUser();
  const username: string = user?.username as string;
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <div className="px-4 lg:px-14 pt-0 md:pt-6">
          <h1 className="text-4xl my-4">Settings</h1>
          <p>{username}</p>
        </div>
      </div>
    </Suspense>
  );
};
export default EditProfile;
