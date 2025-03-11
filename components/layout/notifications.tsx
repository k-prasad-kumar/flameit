import Image from "next/image";
import { ProfileAvatar } from "../avatar";
import Link from "next/link";
import { NotificationInterface } from "@/types/types";
import { getRelativeTime } from "@/lib/relative-time";
import { groupNotificationsByDate } from "@/lib/format-notifications";

const Notifications = ({
  notifications,
}: {
  notifications: NotificationInterface[];
}) => {
  const groupedNotifications = groupNotificationsByDate(notifications);
  return (
    <div className="mx-4 md:mx-0 mb-5 pb-16">
      <h1 className="text-2xl">Notifications</h1>

      {groupedNotifications?.Today?.length > 0 && (
        <div className="font-semibold my-5">Today</div>
      )}
      {groupedNotifications?.Today?.map((notification) => (
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
              className="text-wrap leading-tight text-sm"
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
            <Link
              href={`/p/${notification?.postId}`}
              className={`${!notification?.postImage && "w-1/6"}`}
            >
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-12 rounded-xl object-cover"
                alt="post"
              />
            </Link>
          )}
        </div>
      ))}
      {groupedNotifications?.Yesterday?.length > 0 && (
        <div className="font-semibold my-5">Yesterday</div>
      )}
      {groupedNotifications?.Yesterday?.map((notification) => (
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
              className="text-wrap leading-tight text-sm"
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
            <Link
              href={`/p/${notification?.postId}`}
              className={`${!notification?.postImage && "w-1/6"}`}
            >
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-12 rounded-xl object-cover"
                alt="post"
              />
            </Link>
          )}
        </div>
      ))}

      {groupedNotifications?.["Last 7 Days"]?.length > 0 && (
        <div className="font-semibold my-5">Last 7 Days</div>
      )}
      {groupedNotifications?.["Last 7 Days"]?.map((notification) => (
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
              className="text-wrap leading-tight text-sm"
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
            <Link
              href={`/p/${notification?.postId}`}
              className={`${!notification?.postImage && "w-1/6"}`}
            >
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-12 rounded-xl object-cover"
                alt="post"
              />
            </Link>
          )}
        </div>
      ))}
      {groupedNotifications?.["Last 30 Days"]?.length > 0 && (
        <div className="font-semibold my-5">Last 30 Days</div>
      )}
      {groupedNotifications?.["Last 30 Days"]?.map((notification) => (
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
              className="text-wrap leading-tight text-sm"
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
            <Link
              href={`/p/${notification?.postId}`}
              className={`${!notification?.postImage && "w-1/6"}`}
            >
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-12 rounded-xl object-cover"
                alt="post"
              />
            </Link>
          )}
        </div>
      ))}
      {groupedNotifications?.Older?.length > 0 && (
        <div className="font-semibold my-5">Older</div>
      )}
      {groupedNotifications?.Older?.map((notification) => (
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
              className="text-wrap leading-tight text-sm"
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
            <Link
              href={`/p/${notification?.postId}`}
              className={`${!notification?.postImage && "w-1/6"}`}
            >
              <Image
                src={notification?.postImage as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-12 rounded-xl object-cover"
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
