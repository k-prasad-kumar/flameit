import { ModeToggle } from "@/components/theme.toggle";
import { FlameIcon } from "lucide-react";
import Link from "next/link";

const Header = async () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-inherit z-50">
      <header className="flex justify-between items-center h-14 px-3 md:px-4 lg:px-5">
        <Link href="/" className="flex items-center space-x-1">
          <FlameIcon size={28} />
          <h1 className="text-2xl font-semibold md:font-light mt-1">
            FlameIt.
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </header>
    </div>
  );
};
export default Header;
