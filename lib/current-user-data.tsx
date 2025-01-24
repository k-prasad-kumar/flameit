import { auth } from "@/auth";
import { cache } from "react";
import { getUserByEmail } from "./actions/user.actions";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email as string);

  return session ? user : null;
});
