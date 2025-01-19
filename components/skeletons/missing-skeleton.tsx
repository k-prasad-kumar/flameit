import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const MissingSkeleton = () => {
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
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="w-full h-10"></Skeleton>
            <Skeleton className="w-full h-10"></Skeleton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default MissingSkeleton;
