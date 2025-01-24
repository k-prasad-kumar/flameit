import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const CreatePostSkeleton = () => {
  return (
    <Card className="w-full max-h-full mx-3">
      <CardContent className="max-h-screen max-w-screen-sm">
        <CardHeader className="w-full justify-center">
          <CardTitle className="flex justify-center">
            <Skeleton className="w-40 h-4"></Skeleton>
          </CardTitle>
        </CardHeader>
        <div className="max-h-[70vh]">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-14 h-12 rounded-full"></Skeleton>
            <div className="flex flex-col w-full gap-2">
              <Skeleton className="w-28 h-4"></Skeleton>
              <Skeleton className="w-28 h-3"> </Skeleton>
            </div>
          </div>
          <div className="gap-2 flex flex-wrap my-24"></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="w-28 h-10"></Skeleton>
          <Skeleton className="w-24 h-10"></Skeleton>
        </div>
      </CardContent>
    </Card>
  );
};
export default CreatePostSkeleton;
