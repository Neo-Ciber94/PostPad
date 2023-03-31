import Dialog from "@/components/Dialog";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { Tab } from "@headlessui/react";
import { GoCloudUpload } from "react-icons/go";
import { AiOutlineLink } from "react-icons/ai";
import { BsRobot } from "react-icons/bs";
import { FaImages, FaTrashAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { MdHideImage, MdBrokenImage } from "react-icons/md";
import { useMutation } from "react-query";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { checkIsValidURL } from "@/lib/utils/checkIsValidURL";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { useAbortController } from "@/lib/client/hooks/useAbortController";
import { imageGenerationPromptSchema } from "@/lib/server/schemas/Prompt";

const TABS = [
  { name: "From File", Icon: <GoCloudUpload /> },
  { name: "From URL", Icon: <AiOutlineLink /> },
  { name: "Generate", Icon: <BsRobot /> },
];

export type ImageFromFile = {
  type: "file";
  file: File;
};

export type ImageFromURL = {
  type: "url";
  url: string;
};

export type ImageSource = ImageFromFile | ImageFromURL;

interface ImageInputDialogProps {
  onChange: (image: ImageSource) => void;
  onClose?: () => void;
}

export default function ImageInputDialog(props: ImageInputDialogProps) {
  const { onChange, onClose } = props;
  const [selectedImage, setSelectedImage] = useState<ImageSource | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClose = () => {
    onClose?.();
  };

  const handleChange = (index: number, image: ImageSource) => {
    if (selectedIndex != index) {
      return;
    }

    setSelectedImage(image);
  };

  const handleConfirm = () => {
    if (selectedImage == null) {
      return;
    }

    onChange?.(selectedImage);
  };

  return (
    <Dialog className="bg-base-500 fixed top-10 flex h-[90%] w-[90%] flex-col overflow-hidden p-[13px] md:w-[90%]">
      <div className="flex flex-row justify-end px-3">
        <button className="text-4xl text-white hover:text-red-500" onClick={handleClose}>
          &times;
        </button>
      </div>
      <Tab.Group vertical onChange={setSelectedIndex}>
        <Tab.List className="flex flex-col sm:flex-row">
          {TABS.map((tab) => (
            <Tab
              className={({ selected }) =>
                `border-base-300/20 flex min-w-[150px] flex-row items-center justify-center gap-2 rounded-b-lg rounded-t-lg px-8 pb-2 pt-2 
                font-mono text-lg outline-none transition duration-300 sm:rounded-b-none sm:pb-5 sm:pt-4 ${
                  selected ? "bg-base-300" : "hover:bg-base-600 text-white"
                }`
              }
              key={tab.name}
            >
              {tab.Icon} {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels
          className={({ selectedIndex }) =>
            `bg-base-300 before:bg-base-300 relative h-full w-full rounded-t-lg before:absolute 
            before:top-[-5px] before:hidden before:h-5 before:w-full before:rounded-t-lg sm:rounded-t-none sm:before:block ${
              selectedIndex !== 0 ? "" : ""
            }`
          }
        >
          <Tab.Panel className="h-full w-full" unmount={false}>
            <DragAndDropArea onChange={(img) => handleChange(0, img)} />
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" unmount={false}>
            <URLInputArea onChange={(img) => handleChange(1, img)} />
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" unmount={false}>
            <GenerateImageInputArea onChange={(img) => handleChange(2, img)} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="bg-base-300 flex flex-row justify-end gap-2 rounded-b-lg px-8 pb-4 pt-2">
        <Button
          type="button"
          variant="primary"
          className="border border-violet-300/50"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
        <Button
          type="button"
          variant="error"
          className="border-error-600/50 border"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

interface DragAndDropAreaProps {
  onChange: (image: ImageSource) => void;
}

function DragAndDropArea(props: DragAndDropAreaProps) {
  const { onChange } = props;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { getRootProps, getInputProps, isDragReject, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    disabled: file != null,
    onDrop(files) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const selectedFile = files[0];
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setFile(selectedFile);
      onChange({ type: "file", file: selectedFile });
    },
  });

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <div
      className={`inline-block h-full w-full transition duration-200 ease-in ${
        isDragAccept ? "px-10 pb-6 pt-10" : "px-8 pb-4 pt-8"
      }`}
    >
      <div
        {...getRootProps()}
        className={`h-full w-full cursor-pointer overflow-hidden rounded-xl border-2
        border-dashed p-4
        transition duration-200 ${file ? "" : "hover:bg-base-400/40"} ${
          isDragReject ? "bg-red-500/60" : ""
        } ${isDragAccept ? "bg-green-500/60" : ""}`}
      >
        <input {...getInputProps()} />
        {file && previewUrl ? (
          <ImagePreview onRemove={handleRemoveImage} name={file.name} url={previewUrl} showName />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <FaImages className="text-8xl text-white" />
            <div className="flex flex-col items-center justify-center text-lg text-white">
              <span className="font-bold">Drag & Drop</span>
              <span>or</span>
              <span>Browse</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface URLInputAreaProps {
  onChange: (image: ImageSource) => void;
}

function URLInputArea(props: URLInputAreaProps) {
  const { onChange } = props;
  const [url, setUrl] = useState<string>("");

  const handleRemoveUrl = () => {
    setUrl("");
  };

  const handleSetImageUrl = useCallback(
    (url: string) => {
      setUrl(url);
      onChange({ type: "url", url });
    },
    [onChange]
  );

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value.trim();
    handleSetImageUrl(newUrl);
  };

  useEffect(() => {
    if (!navigator.clipboard) {
      return;
    }

    const checkClipboard = async () => {
      if (url.trim().length > 0) {
        return;
      }

      const clipboardURL = await navigator.clipboard.readText().then((s) => s.trim());
      if (checkIsValidURL(clipboardURL)) {
        console.log({ clipboardURL });
        handleSetImageUrl(clipboardURL);
      }
    };

    window.addEventListener("focus", checkClipboard);
    return () => {
      window.removeEventListener("focus", checkClipboard);
    };
  }, [handleSetImageUrl, url]);

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full w-full flex-col justify-center">
        <div className="relative w-full">
          <label htmlFor="url-input" className="text-sm text-white">
            Enter the URL of the image
          </label>
          <div className="relative mt-1">
            <input
              id="url-input"
              type="url"
              placeholder="Image URL"
              value={url}
              onChange={handleUrlChange}
              className="h-10 w-full rounded-lg py-2 pl-14 pr-5 shadow-md outline-none"
            />

            <span>
              <AiOutlineLink className="absolute left-4 top-2 text-2xl opacity-40" />
            </span>
          </div>
        </div>

        <div className="my-4 h-full w-full rounded-lg border-2 border-dashed border-white p-2">
          {url && <ImagePreview url={url} name={url} onRemove={handleRemoveUrl} />}

          {!url && (
            <div className="flex h-full w-full cursor-pointer flex-row items-center justify-center gap-1 px-4 text-white">
              <MdHideImage className="text-4xl" />
              <span className="my-3 text-2xl">No image URL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PLACEHOLDER_PROMPTS = [
  "A dragon made of flowers, in a fantasy watercolor style",
  "A spooky haunted house",
  "A beautiful japanese garden, watercolor style",
  "A white cat, anime style",
];

interface GenerateImageInputAreaProps {
  onChange: (image: ImageSource) => void;
}

type ImagePrompt = z.infer<typeof imageGenerationPromptSchema>;

function GenerateImageInputArea(props: GenerateImageInputAreaProps) {
  const { onChange } = props;
  const placeholderPrompt = useMemo(
    () => PLACEHOLDER_PROMPTS[Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length)],
    []
  );

  const abortController = useAbortController();
  const { register, handleSubmit } = useForm<ImagePrompt>({});

  const generateImageMutation = useMutation(
    async (prompt: string) => {
      console.log(prompt);
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({ prompt }),
      });

      await throwOnResponseError(res);
      const json = await res.json();
      const { url } = json;
      onChange({ type: "url", url });
    },
    {
      onError(error) {
        toast.error(getErrorMessage(error) ?? "Something went wrong");
      },
    }
  );

  const onGenerateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (generateImageMutation.isLoading) {
      abortController.abort();
      generateImageMutation.reset();
      return;
    }

    const submit = handleSubmit(({ prompt }) => generateImageMutation.mutateAsync(prompt));
    await submit(e);
  };

  return (
    <div className="mr-1 flex h-full w-full flex-col p-4">
      <div className="w-full">
        <label htmlFor="generate-input" className="text-sm text-white">
          Write a description of the image to generate
        </label>
        <div className="relative mt-1">
          <input
            id="generate-input"
            type="url"
            placeholder={placeholderPrompt}
            className="h-10 w-full rounded-lg py-2 pl-4 pr-[135px] shadow-md outline-none"
            suppressHydrationWarning
            {...register("prompt")}
          />

          <button
            type="button"
            disabled={generateImageMutation.isLoading}
            onClick={onGenerateClick}
            className={`bg-base-500  absolute right-0 top-0 h-full min-w-[130px] cursor-pointer rounded-r-lg
            px-6 font-semibold text-white shadow-md transition duration-200 ${
              generateImageMutation.isLoading ? "hover:bg-red-600" : "hover:bg-base-700"
            }`}
          >
            {generateImageMutation.isLoading ? (
              <LoadingSpinner width={2} size={25} />
            ) : (
              <span>Generate</span>
            )}
          </button>
        </div>
      </div>

      <div className="relative h-full">
        <div
          className="scrollbar-thin scrollbar-track-base-300/25 scrollbar-thumb-base-900 absolute 
        mt-2 grid h-full w-full grid-cols-1 gap-4 overflow-auto p-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {range(10).map((idx) => (
            <picture key={idx}>
              <img
                alt={String(idx)}
                src={`https://via.placeholder.com/512x512/EEEEEE?text=${idx + 1}`}
              />
            </picture>
          ))}
        </div>
      </div>
    </div>
  );
}

function range(max: number): number[] {
  return [...Array(max).keys()];
}

interface ImagePreviewProps {
  url: string;
  name: string;
  onRemove: (e: React.MouseEvent) => void;
  showName?: boolean;
}

function ImagePreview(props: ImagePreviewProps) {
  const { url, onRemove, name, showName } = props;
  const [show, setShow] = useState(false);
  const [hasError, setHasError] = useState(false);

  // We check the url is valid and not relative
  const isURLValid = useMemo(() => checkIsValidURL(url), [url]);

  // We reset the state on url change
  useEffect(() => {
    setHasError(false);
    setShow(false);
  }, [url]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(e);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto text-white">
      <div className="flex-end flex flex-row">
        <button
          type="button"
          onClick={handleRemove}
          className="text-base-600 absolute right-0 top-0 z-20 hover:text-red-300"
        >
          <FaTrashAlt className="text-4xl " />
        </button>
      </div>
      {!hasError && isURLValid && (
        <picture
          className={`absolute mx-auto flex h-full w-full items-center justify-center shadow-lg shadow-black/50
      ${showName ? "pb-10" : ""}`}
        >
          <img
            className={`h-full w-auto object-contain ${show ? "" : "hidden"}`}
            src={url}
            alt={name}
            onLoad={() => setShow(true)}
            onError={handleError}
          />
        </picture>
      )}

      {hasError ||
        (!isURLValid && (
          <div className="flex flex-row items-center justify-center gap-1 px-4 text-red-300">
            <MdBrokenImage className="text-4xl" />
            <span className="my-3 text-2xl">Not image found</span>
          </div>
        ))}

      {showName && (
        <span
          className="absolute bottom-2 max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap text-center"
          title={name}
        >
          {name}
        </span>
      )}
    </div>
  );
}
