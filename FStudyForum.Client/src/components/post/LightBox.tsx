import { FC } from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/helpers/utils";
import "yet-another-react-lightbox/styles.css";

type Props = {
  index: number;
  sliders?: SlideImage[];
  close?: () => void;
};

const LightBox: FC<Props> = ({ index, sliders, close }) => {
  const hideArrow = (sliders?.length ?? 0) <= 1;
  return (
    <Lightbox
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, .8)" },
        button: { filter: "none" }
      }}
      plugins={[Zoom]}
      carousel={{ finite: hideArrow }}
      className="!overflow-hidden"
      render={{
        iconPrev: () => (
          <div className="rounded-full bg-gray-900/50 text-white/50 hover:text-white hover:bg-gray-900/60 p-2 hidden md:block">
            <ChevronLeft strokeWidth={2} className={cn("w-6 h-6")} />
          </div>
        ),
        iconNext: () => (
          <div className="rounded-full bg-gray-900/50 text-white/50 hover:text-white hover:bg-gray-900/60 p-2 hidden md:block">
            <ChevronRight strokeWidth={2} className={cn("w-6 h-6")} />
          </div>
        ),
        iconClose: () => (
          <div className="rounded-full bg-gray-900/80  hover:bg-gray-900/60 p-2">
            <X strokeWidth={2} className="w-6 h-6 text-white" />
          </div>
        ),
        iconZoomIn: () => (
          <div className="rounded-full bg-gray-900/50 hover:bg-gray-900/60 p-2 text-white">
            <ZoomIn strokeWidth={2} className={cn("w-6 h-6")} />
          </div>
        ),
        iconZoomOut: () => (
          <div className="rounded-full bg-gray-900/50 hover:bg-gray-900/60 p-2 text-white">
            <ZoomOut strokeWidth={2} className={cn("w-6 h-6 ")} />
          </div>
        ),
        buttonPrev: hideArrow ? () => null : undefined,
        buttonNext: hideArrow ? () => null : undefined
      }}
      zoom={{
        maxZoomPixelRatio: 5
      }}
      open={index !== -1}
      close={close}
      index={index}
      slides={sliders}
    />
  );
};

export default LightBox;
