import { FC, useEffect } from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { cn } from "@/helpers/utils";
import Inline from "yet-another-react-lightbox/plugins/inline";
import "yet-another-react-lightbox/styles.css";

type Props = {
  slide: SlideImage;
  expand?: boolean;
  hideArrow?: boolean;
  onExpand?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
};

const Carousel: FC<Props> = ({
  slide,
  expand = false,
  hideArrow = false,
  onExpand,
  onNext,
  onPrev,

  className
}) => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const next = document.querySelector(
        ".yarl__navigation_next"
      ) as HTMLButtonElement | null;
      const prev = document.querySelector(
        ".yarl__navigation_prev"
      ) as HTMLButtonElement | null;

      if (next && prev) {
        next.disabled = false;
        prev.disabled = false;
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);
  return (
    <Lightbox
      plugins={[Zoom, Inline]}
      carousel={{ finite: true, imageFit: "contain" }}
      slides={[slide]}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, .8)" },
        button: { filter: "none" }
      }}
      toolbar={{
        buttons: [
          <button
            key="my-button"
            type="button"
            className="yarl__button !filter-none"
            onClick={onExpand}
          >
            <div className="rounded-full bg-gray-900/50  hover:bg-gray-900/60 p-2.5 text-white">
              {!expand ? (
                <Maximize2 strokeWidth={3} className="w-4 h-4" />
              ) : (
                <Minimize2 strokeWidth={3} className="w-4 h-4" />
              )}
            </div>
          </button>
        ]
      }}
      className={cn(className)}
      render={{
        iconPrev: () => (
          <div
            className="rounded-full bg-gray-900/40 hover:bg-gray-900/50 text-gray-400 hover:text-white  p-2 hidden md:block"
            onClick={e => {
              e.stopPropagation();
              onPrev && onPrev();
            }}
          >
            <ChevronLeft strokeWidth={2} className={cn("w-6 h-6")} />
          </div>
        ),
        iconNext: () => (
          <div
            className="rounded-full bg-gray-900/40 hover:bg-gray-900/50 text-gray-400 hover:text-white  p-2 hidden md:block"
            onClick={e => {
              e.stopPropagation();
              onNext && onNext();
            }}
          >
            <ChevronRight strokeWidth={2} className={cn("w-6 h-6")} />
          </div>
        ),
        iconZoomIn: () => (
          <div className="rounded-full bg-gray-900/40 hover:bg-gray-900/50 p-1.5 text-white">
            <ZoomIn strokeWidth={2} className={cn("w-6 h-6")} />
          </div>
        ),
        iconZoomOut: () => (
          <div className="rounded-full bg-gray-900/40 hover:bg-gray-900/50 p-1.5 text-white">
            <ZoomOut strokeWidth={2} className={cn("w-6 h-6 ")} />
          </div>
        ),
        buttonPrev: hideArrow ? () => null : undefined,
        buttonNext: hideArrow ? () => null : undefined
      }}
      zoom={{
        doubleClickMaxStops: 0,
        maxZoomPixelRatio: 5
      }}
    />
  );
};

export default Carousel;
