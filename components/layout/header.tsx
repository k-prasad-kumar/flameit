"use client";

import { ModeToggle } from "@/components/theme.toggle";
import { useSocket } from "@/context/use.socket";
import {
  getNotSeenNotification,
  updateNotification,
} from "@/lib/actions/notification.actions";
import { NotificationsInterface } from "@/types/types";
import { FlameIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Header = ({ userId }: { userId: string }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0); // ✅ Store scroll position in ref
  const [notifications, setNotifications] = useState<NotificationsInterface[]>(
    []
  );
  const socket = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      const newNotifications = await getNotSeenNotification(userId);
      if (newNotifications) {
        setNotifications(newNotifications);
      }
    };

    fetchNotifications();

    // ✅ Real-time notification listener
    if (socket) {
      const handleNewNotification = (
        newNotification: NotificationsInterface
      ) => {
        setNotifications((prev) => [newNotification, ...prev]); // Append new notifications
      };

      socket.on("notification", handleNewNotification);

      return () => {
        socket.off("notification", handleNewNotification); // ✅ Cleanup listener on unmount
      };
    }
  }, [userId, socket]); // ✅ Only re-run when userId or socket changes

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          setShowNavbar(
            currentScrollY < lastScrollY.current || currentScrollY < 50
          );
          lastScrollY.current = currentScrollY; // ✅ Update ref without causing re-renders

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ No dependencies, so effect runs only once

  const handleNotifications = async () => {
    await updateNotification(userId);
    setNotifications([]);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-white dark:bg-inherit z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <header className="flex justify-between items-center h-14 px-3 md:px-4 lg:px-5">
        <Link href="/" className="flex items-center space-x-1">
          <FlameIcon size={32} />
          <h1 className="text-2xl font-semibold mt-1">FlameIt.</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {userId && (
            <Link
              href={"/notifications"}
              className="relative p-1"
              onClick={() => handleNotifications()}
            >
              <HeartIcon strokeWidth={1.5} size={28} />
              <div
                className={`bg-red-500 rounded-full absolute top-[1px] right-[1px] text-white text-[10px] w-4 h-4 text-center ${
                  notifications && notifications?.length > 0
                    ? "block"
                    : "hidden"
                }`}
              >
                {notifications?.length}
              </div>
            </Link>
          )}
          <ModeToggle />
        </div>
      </header>
    </div>
  );
};
export default Header;
