import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LockIcon } from "lucide-react";

const Logout = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        type="submit"
        variant={"link"}
        className="border cursor-pointer w-full"
      >
        <span className="flex gap-2">
          <LockIcon /> Logout
        </span>
      </Button>
    </form>
  );
};

export default Logout;
