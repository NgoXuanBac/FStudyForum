import { Card } from "@material-tailwind/react";
import { FC, PropsWithChildren } from "react";

const Panel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card className="mx-4 rounded-lg shadow-none bg-blue-gray-50/50 max-h-full overflow-y-auto scrollbar">
      {children}
    </Card>
  );
};

export default Panel;
