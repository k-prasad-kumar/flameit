import { SendIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";

const SharePost = () => {
  return (
    <div>
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger>
            <SendIcon
              strokeWidth={1.5}
              size={30}
              aria-description="Share post"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share</DialogTitle>
            </DialogHeader>
            <div>Conetent</div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger>
            <SendIcon
              strokeWidth={1.5}
              size={30}
              aria-description="Share post"
            />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DialogTitle>Share</DialogTitle>
            </DrawerHeader>
            <div>Conetent</div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
export default SharePost;
