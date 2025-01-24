import { Suspense } from "react";
import Loading from "./loading";
import { ProfileAvatar } from "@/components/avatar";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Phone, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user-data";

const Chat = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const username: string = user?.username as string;
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full max-w-screen-sm mx-auto mt-16 md:mt-10">
        <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 flex flex-col items-between mx-4 md:mx-0">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <Link href={"/inbox"}>
                <ArrowLeft size={24} strokeWidth={1} />
              </Link>
              <Link
                href={`/${username}`}
                className="flex items-center space-x-3"
              >
                <ProfileAvatar
                  image="https://github.com/shadcn.png"
                  alt="profile"
                  width="12"
                  height="12"
                />
                <div className="flex flex-col">
                  <p className="text-lg flex items-center">
                    {username} <ChevronRight size={16} strokeWidth={1} />
                  </p>
                  <p className="text-xs">{username}</p>
                </div>
              </Link>
            </div>
            <Phone size={24} strokeWidth={1} className="mr-3" />
          </div>
          <ScrollArea className="w-full h-[75vh] max-h-[75vh] md:h-[80vh] md:max-h-[80vh] py-4">
            <div className="space-y-2 py-2 w-full h-full flex gap-2 flex-col">
              <p className="w-full text-center text-xs">Sun 2:30 PM</p>
              <div className="flex space-x-2 w-3/4">
                <Link href={`/${username}`}>
                  <ProfileAvatar
                    image="https://github.com/shadcn.png"
                    alt="profile"
                    width="6"
                    height="6"
                  />
                </Link>
                <div className="max-w-3/4">
                  <p className="text-sm px-5 py-2 border rounded-xl bg-gray-100 dark:bg-gray-600 max-w-3/4">
                    I am a software developer Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Itaque ab quam consequatur
                    ipsum, eius ad optio distinctio aspernatur. Nesciunt
                    dignissimos accusantium nam quo dolores delectus porro, id
                    accusamus facere beatae?
                  </p>
                </div>
              </div>
              <div className="space-x-2 w-full max-3/4 grid justify-items-stretch">
                <p className="text-sm px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-600 w-3/4 max-w-3/4 justify-self-end">
                  Ohh nice Lorem ipsum dolor sit amet consectetur, adipisicing
                  elit. Nulla architecto ullam vitae tenetur iste, debitis esse
                  laboriosam sequi, consectetur cum id ducimus, nisi explicabo
                  quam consequuntur. Perferendis tempora dolor autem? Lorem
                  ipsum dolor sit amet consectetur adipisicing elit. Error illo
                  voluptatum ipsa totam possimus impedit quibusdam excepturi
                  quis, vel iusto pariatur temporibus sint aliquid quas
                  consequatur incidunt explicabo quisquam? Lorem ipsum dolor
                  sit, amet consectetur adipisicing elit. Ab cum, consequuntur
                  vel facere nam tenetur maxime, totam quae quia id corrupti!
                  Velit hic dicta nemo eaque eum esse distinctio commodi! Lorem
                  ipsum dolor sit amet consectetur, adipisicing elit.
                  Praesentium perspiciatis ea mollitia eligendi molestias illum!
                  Optio, quidem doloremque, est amet illo corporis illum earum
                  rem nemo sed expedita vero laboriosam. Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Sunt voluptates inventore
                  aut ratione porro. Minus corporis, officia voluptas omnis
                  perspiciatis voluptatibus eaque, consequuntur similique
                  deleniti asperiores quasi tempore unde amet.lore Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Sit quibusdam
                  aspernatur eos. Accusamus modi et maxime, dolores quibusdam
                  similique ipsa optio commodi ullam cupiditate nobis vitae quas
                  vel eos dolorem.lore Lorem ipsum dolor, sit amet consectetur
                  adipisicing elit. Iste eius perspiciatis earum blanditiis
                  autem enim hic quo, maxime dolor tempore ut, architecto veniam
                  magni. Reprehenderit assumenda quis ducimus maxime
                  consequatur! Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Asperiores omnis, deleniti tenetur minus
                  esse eaque sit, necessitatibus, quasi quis laudantium dolorem
                  dolores deserunt! Eos, molestiae aspernatur voluptatum unde
                  tempora velit.
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="w-full flex items-center gap-2">
            <Input type="text" placeholder="Type a message..." />
            <Button variant={"blue"}>
              <SendIcon size={24} strokeWidth={1} />
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Chat;
