import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Logout = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">Logout</Button>
    </form>
  );
};

export default Logout;
