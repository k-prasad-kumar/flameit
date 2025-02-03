import Notifications from "@/components/layout/notifications";
import { getNotifications } from "@/lib/actions/notification.actions";
import { getCurrentUser } from "@/lib/current-user-data";
import { NotificationInterface } from "@/types/types";
import { BellOffIcon } from "lucide-react";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = await getNotifications(user?.id as string);

  const notSeenNotifications =
    notifications?.notSeenNotifications as NotificationInterface[];
  const seenNotifications =
    notifications?.seenNotifications as NotificationInterface[];

  if (
    !notSeenNotifications ||
    (notSeenNotifications?.length === 0 && !seenNotifications) ||
    seenNotifications?.length === 0
  ) {
    return (
      <div className="w-full h-screen max-w-screen-sm mx-auto mt-14 md:mt-14">
        <h1 className="text-2xl">Notifications</h1>
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 w-full h-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-3">
            <BellOffIcon strokeWidth={1} size={64} />
            <h2 className="text-2xl">No notifications yet.</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
        <Notifications
          notSeenNotifications={notSeenNotifications!}
          seenNotifications={seenNotifications!}
        />
      </div>
    </div>
  );
};
export default page;
