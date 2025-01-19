import Register from "@/components/auth/register";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/login/loading";

const RegisterPage = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) redirect("/");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto my-14">
        <div className="px-4 lg:px-14 pt-0 md:pt-6 flex justify-center items-center w-full h-full">
          <Register />
        </div>
      </div>
    </Suspense>
  );
};
export default RegisterPage;
