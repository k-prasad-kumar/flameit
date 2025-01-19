import { TriangleAlertIcon } from "lucide-react";

interface FromErrorProps {
  message?: string;
}
const FormError = ({ message }: FromErrorProps) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center text-destructive text-sm gap-x-2">
      <TriangleAlertIcon className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
export default FormError;
