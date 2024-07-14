import React from "react";
import { FC } from "react";
import ReactDOM from "react-dom";

type Props = {
  id: number;
};

const BoxComment: FC<Props> = ({ id }) => {
  const [container, setContainer] = React.useState<Element | null>(null);
  console.log(container);

  React.useEffect(() => {
    const lightBox = document.querySelector(".yarl__container");
    if (lightBox) {
      setContainer(lightBox);
    }
  }, []);

  if (!container) return null;

  return ReactDOM.createPortal(
    <div className="bg-white h-screen w-screen">Comment of {id}</div>,
    container
  );
};

export default BoxComment;
