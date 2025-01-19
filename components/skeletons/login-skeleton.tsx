import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

const LoginSkeleton = () => {
  return (
    <Card className="w-full px-0 md:px-4">
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify- gap-4 py-2">
          <Skeleton className="w-14 h-14"></Skeleton>
          <Skeleton className="w-40 h-4"></Skeleton>
        </CardTitle>
        <CardDescription className="flex items-center justify-center">
          <Skeleton className="w-5/6 h-4"></Skeleton>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 w-full">
          <div className="w-full">
            <span className="w-full">
              <Skeleton className="w-full h-10"></Skeleton>
            </span>
          </div>

          <div className="w-full">
            <span className="w-full">
              <Skeleton className="w-full h-10"></Skeleton>
            </span>
          </div>
        </div>
        <div className="my-8 flex items-center justify-center relative">
          <Separator />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="w-full h-10"></Skeleton>
            <Skeleton className="w-full h-10"></Skeleton>
            <Skeleton className="w-full h-10"></Skeleton>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Skeleton className="w-4/6 h-4"></Skeleton>
      </CardFooter>
    </Card>
  );
};
export default LoginSkeleton;
