import { FC } from "react";
import { generateHTML } from "@tiptap/html";
import { JSONContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Placeholder from "@tiptap/extension-placeholder";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  attributesToProps,
  domToReact
} from "html-react-parser";
import Code from "@tiptap/extension-code";
import { cn } from "@/helpers/utils";
import TruncateMarkup from "react-truncate-markup";

interface Props {
  className?: string;
  content: string;
  hide: boolean;
}

const options: HTMLReactParserOptions = {
  replace: domNode => {
    const { attribs, name, children } = domNode as Element;

    if (attribs && name === "p") {
      return (
        <span {...attributesToProps(attribs)} className="break-words w-full">
          {" "}
          {children && domToReact(children as DOMNode[], options)}
        </span>
      );
    }
    return false;
  }
};

const EditorOutput: FC<Props> = ({ content, className, hide }) => {
  const parseContent = (content: string, options?: HTMLReactParserOptions) => {
    return parse(
      generateHTML(JSON.parse(content) as JSONContent, [
        Document,
        Dropcursor,
        Image,
        Paragraph.configure({
          HTMLAttributes: { className: "break-words" }
        }),
        Text,
        Bold,
        Placeholder,
        Code
      ]),
      options
    );
  };
  return (
    <div className={cn(className)}>
      {hide ? (
        <TruncateMarkup lines={4}>
          <div className={cn("text-sm w-full")}>
            {parseContent(content, options)}
          </div>
        </TruncateMarkup>
      ) : (
        <div className={cn("text-sm w-full")}>{parseContent(content)}</div>
      )}
    </div>
  );
};

export default EditorOutput;
