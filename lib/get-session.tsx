import { auth } from "@/auth";
import { cache } from "react";
import { getUserByEmail } from "./actions/user.actions";

export const getSession = cache(async () => {
  const session = await auth();
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  const user = await getUserByEmail(session?.user?.email as string);
  return user;
});
