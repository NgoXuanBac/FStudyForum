import { EditPost, Post } from "@/types/post";
import { FC } from "react";
import { cn } from "@/helpers/utils";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-tailwind/react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { Response } from "@/types/response";
import { useForm } from "react-hook-form";
import {
  EditorContent,
  generateHTML,
  JSONContent,
  useEditor
} from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import FileInput, { FileInputContext, FileWithURL } from "./FileInput";
import DefaultTopic from "@/assets/images/topic.png";
import DefaultUser from "@/assets/images/user.png";
import { Attachment } from "@/types/attachment";
import PostService from "@/services/PostService";
import { AxiosError } from "axios";
import { CircleAlert, X } from "lucide-react";
import { deleteFiles } from "@/helpers/storage";
import useUnmounted from "@/hooks/useUnmounted";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  post: Post;
  handler: () => void;
};

const validation = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be longer than 3 characters")
    .max(128, "Title must be shorter than 128 characters")
});
interface PostSubmit {
  title: string;
  content?: string;
}
export type Context = {
  prefix: string;
  name: string;
  avatar: string;
};
const extensions = [
  Document,
  Paragraph,
  Text,
  Image,
  Dropcursor,
  Bold,
  Code,
  Placeholder.configure({
    placeholder: "Write something …",
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] before:absolute before:opacity-50 "
  })
];
const EditPostForm: FC<Props> = ({ post, handler }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PostSubmit>({
    resolver: yupResolver(validation),
    defaultValues: {
      title: post.title
    }
  });
  const queryClient = useQueryClient();

  const context: Context = React.useMemo(() => {
    if (post.topicName)
      return {
        prefix: "t",
        name: post.topicName,
        avatar: post.topicAvatar || DefaultTopic
      };
    else
      return {
        prefix: "u",
        name: post.author,
        avatar: post.authorAvatar || DefaultUser
      };
  }, [post.author, post.authorAvatar, post.topicAvatar, post.topicName]);

  const editor = useEditor({
    extensions,
    content: generateHTML(JSON.parse(post.content) as JSONContent, extensions),
    editorProps: {
      attributes: {
        class: "focus:outline-none  min-h-12"
      }
    }
  });

  const [files, setFiles] = React.useState<FileWithURL[]>(
    post.attachments.map<FileWithURL>(attachment => {
      return {
        preview: "",
        ...attachment
      };
    })
  );

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [temp, setTemp] = React.useState<string[]>([]);

  const moveTemp = (url: string) => setTemp(pre => [...pre, url]);

  const { mutate: handleEdit } = useMutation({
    mutationFn: async (data: PostSubmit) => {
      if (!editor) return;
      if (!context) throw Error("Topic name is required");
      if (!isFileLoaded) throw Error("Wait until the files are uploaded");
      setLoading(true);

      const payload: EditPost = {
        title: data.title,
        content: JSON.stringify(editor.getJSON()),
        attachments: files.map<Attachment>(file => {
          return {
            url: file.url!,
            name: file.name,
            type: file.type,
            size: file.size
          };
        })
      };
      await PostService.edit(post.id, payload);
    },
    onError: e => {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    },
    onSuccess: async () => {
      const attachmentUrls = files.map(f => f.url!);
      const trashUrls = temp.filter(url => !attachmentUrls.includes(url));
      setTemp([]);
      await deleteFiles(trashUrls);
      queryClient.invalidateQueries({
        queryKey: ["POST_DETAIL", post.id + ""],
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["POST_LIST"],
        refetchType: "all"
      });
      handler();
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  useUnmounted(async () => {
    files.map(file => file.preview && URL.revokeObjectURL(file.preview));
    temp.length && (await deleteFiles(temp));
  });

  const isFileLoaded = files.every(file => file.url);
  if (!editor) return null;

  return (
    <div className="relative">
      <h1 className="font-semibold text-center text-lg">Edit post</h1>
      <button
        type="button"
        className="absolute p-1 bg-blue-gray-700/50 rounded-full right-0 top-0"
        onClick={handler}
      >
        <X className="text-white w-4 h-4" />
      </button>
      <FileInputContext.Provider value={{ files, setFiles, moveTemp }}>
        <form
          id="create-post-form"
          className="w-full p-4 bg-zinc-50  text-blue-gray-700"
          onSubmit={handleSubmit(data => handleEdit(data))}
        >
          <TextareaAutosize
            placeholder="Title"
            className={cn(
              "w-full  resize-none appearance-none overflow-hidden bg-transparent",
              "text-md focus:outline-none font-semibold"
            )}
            {...register("title")}
          />
          {errors.title && (
            <span
              className={cn(
                "text-red-500 text-xs ml-1 mb-1 flex gap-x-1 items-center"
              )}
            >
              <CircleAlert className="w-3 h-3" /> {errors.title.message}
            </span>
          )}
          <hr className="border-b" />
          <EditorContent editor={editor} className="text-sm my-2" />
          <FileInput />
          {error && (
            <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1 gap-x-1 ">
              <CircleAlert className="w-3 h-3" /> {error}
            </span>
          )}
        </form>
      </FileInputContext.Provider>
      <div className="flex items-center justify-end">
        <Button
          variant="gradient"
          color="deep-orange"
          type="submit"
          className="mt-2 w-full lg:w-fit normal-case text-sm"
          form="create-post-form"
          disabled={context == undefined || loading || !isFileLoaded}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default EditPostForm;
