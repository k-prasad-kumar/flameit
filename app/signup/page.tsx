import Register from "@/components/auth/register";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/signup/loading";

const RegisterPage = async () => {
  const user = await getCurrentUser();
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
