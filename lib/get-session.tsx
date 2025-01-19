import { auth } from "@/auth";
import { User } from "@/models/user.model";
import { cache } from "react";

export const getSession = cache(async () => {
  const session = await auth();
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  const user = await User.findOne({ email: session?.user?.email });
  return user;
});
