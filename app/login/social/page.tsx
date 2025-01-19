import MissingForm from "@/components/auth/social-login";
import { getUserByEmail, socialLogin } from "@/lib/actions/user.actions";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/login/social/loading";

const Social = async () => {
  const session = await getSession();

  if (!session) return redirect("/login");

  // checking if user is already logged in before using social login
  const user = await getUserByEmail(session?.user?.email as string);
  if (user) return redirect("/");

  await socialLogin({
    name: session?.user?.name as string,
    email: session?.user?.email as string,
    profilePicture: session?.user?.image as string,
  });

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-[calc(100vh-64px)] max-w-screen-sm mx-auto my-6">
        <div className="px-4 lg:px-14 pt-0 md:pt-6 flex justify-center items-center w-full h-full">
          <MissingForm email={session?.user?.email as string} />
        </div>
      </div>
    </Suspense>
  );
};
export default Social;
