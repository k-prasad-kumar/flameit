import Login from "@/components/auth/login";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/login/loading";

const LoginPage = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) redirect("/");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-[calc(100vh-64px)] max-w-screen-sm mx-auto my-6">
        <div className="px-4 lg:px-14 pt-0 md:pt-6 flex justify-center items-center w-full h-full">
          <Login />
        </div>
      </div>
    </Suspense>
  );
};
export default LoginPage;
