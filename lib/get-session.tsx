import { auth } from "@/auth";
import { cache } from "react";
import { getUserByEmail } from "./actions/user.actions";

export const getSession = cache(async () => {
  const session = await auth();
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  console.log(session);
  // const user = await getUserByEmail(session?.user?.email as string);
  const user = await getUserByEmail("prasadkumar1431234@gmail.com");
  return user;
});
