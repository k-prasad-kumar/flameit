import { ModeToggle } from "@/components/theme.toggle";
import { getNotSeenNotification } from "@/lib/actions/notification.actions";
import { FlameIcon, HeartIcon } from "lucide-react";
import Link from "next/link";

const Header = async ({ userId }: { userId: string }) => {
  const notifications = await getNotSeenNotification(userId);

  return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-inherit z-50">
      <header className="flex justify-between items-center h-14 px-3 md:px-4 lg:px-5">
        <Link href="/" className="flex items-center space-x-1">
          <FlameIcon size={32} />
          <h1 className="text-2xl font-semibold mt-1">FlameIt.</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href={"/notifications"} className="relative p-1">
            <HeartIcon strokeWidth={1.5} size={28} />
            <div
              className={`bg-red-500 rounded-full absolute top-[1px] right-[1px] text-white text-[10px] w-4 h-4 text-center ${
                notifications && notifications?.length > 0 ? "block" : "hidden"
              }`}
            >
              {notifications?.length}
            </div>
          </Link>
          <ModeToggle />
        </div>
      </header>
    </div>
  );
};
export default Header;
