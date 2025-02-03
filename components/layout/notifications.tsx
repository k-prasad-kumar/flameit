import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import Link from "next/link";
import { NotificationInterface } from "@/types/types";
import { getRelativeTime } from "@/lib/relative-time";

const Notifications = ({
  notSeenNotifications,
  seenNotifications,
}: {
  notSeenNotifications: NotificationInterface[];
  seenNotifications: NotificationInterface[];
}) => {
  return (
    <div className="mx-4 md:mx-0 mb-5">
      <h1 className="text-2xl">Notifications</h1>
      {notSeenNotifications?.length > 0 && (
        <h2 className="opacity-65 text-green-500 mt-4 w-full text-center">
          New notifications.
        </h2>
      )}
      {notSeenNotifications?.map((notification) => (
        <div className="flex items-center h-14 mt-4" key={notification.id}>
          <Link
            href={`/${notification?.user?.username}`}
            className="w-fit mr-3"
          >
            <ProfileAvatar
              width="14"
              height="14"
              image={notification?.user?.image as string}
              alt="profile"
            />
          </Link>
          <div className="w-4/6 flex flex-col gap-1">
            <Link
              href={`/${notification?.user?.username}`}
              className="truncate"
            >
              {" "}
              <span className="font-semibold">
                {notification?.user?.username}
              </span>{" "}
              {notification?.text}
            </Link>
            <p className="text-xs opacity-65">
              {getRelativeTime(notification?.createdAt)}
            </p>
          </div>
          {notification?.postImage && (
            <Link href={`/p/${notification?.postId}`} className="w-1/6">
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-14 object-cover"
                alt="post"
              />
            </Link>
          )}
        </div>
      ))}

      {notSeenNotifications?.length > 0 && (
        <h2 className="opacity-65 mt-4 w-full text-center">
          Older notifications.
        </h2>
      )}
      {seenNotifications?.map((notification) => (
        <div className="flex items-center h-14 mt-4" key={notification.id}>
          <Link
            href={`/${notification?.user?.username}`}
            className="w-fit mr-3"
          >
            <ProfileAvatar
              width="14"
              height="14"
              image={notification?.user?.image as string}
              alt="profile"
            />
          </Link>
          <div className="w-4/6 flex flex-col gap-1">
            <Link
              href={`/${notification?.user?.username}`}
              className="truncate"
            >
              {" "}
              <span className="font-semibold">
                {notification?.user?.username}
              </span>{" "}
              {notification?.text}
            </Link>
            <p className="text-xs opacity-65">
              {getRelativeTime(notification?.createdAt)}
            </p>
          </div>
          {notification?.postImage && (
            <Link href={`/p/${notification?.postId}`} className="w-1/6">
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-14 object-cover"
                alt="post"
              />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
export default Notifications;
