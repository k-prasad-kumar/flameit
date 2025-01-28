import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import SearchPage from "@/components/search/search";

const Search = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <SearchPage />
      </div>
    </Suspense>
  );
};
export default Search;
