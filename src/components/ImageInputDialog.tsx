import Dialog from "@/components/Dialog";
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { Tab } from "@headlessui/react";
import { GoCloudUpload } from "react-icons/go";
import { AiOutlineLink } from "react-icons/ai";
import { BsRobot } from "react-icons/bs";
import { FaImages, FaTrashAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { MdHideImage, MdBrokenImage, MdWarning } from "react-icons/md";

const TABS = [
  { name: "From File", Icon: <GoCloudUpload /> },
  { name: "From URL", Icon: <AiOutlineLink /> },
  { name: "Generate", Icon: <BsRobot /> },
];

interface ImageInputDialogProps {
  onChange: (file: File) => void;
  onClose?: () => void;
}

export default function ImageInputDialog(props: ImageInputDialogProps) {
  const { onChange, onClose } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    if (selectedFile == null) {
      return;
    }

    onChange?.(selectedFile);
  };

  return (
    <Dialog className="bg-base-500 fixed top-10 flex h-[90%] w-[90%] flex-col overflow-hidden p-[13px] md:w-[90%]">
      <div className="flex flex-row justify-end px-3">
        <button className="text-4xl text-white hover:text-red-500" onClick={handleClose}>
          &times;
        </button>
      </div>
      <Tab.Group>
        <Tab.List className="flex flex-row">
          {TABS.map((tab) => (
            <Tab
              className={({ selected }) =>
                `border-base-300/20 flex min-w-[150px] flex-row items-center justify-center gap-2 rounded-t-lg px-8 pb-5 pt-4 
                font-mono text-lg shadow-2xl outline-none transition duration-300 ${
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
            `bg-base-300 before:bg-base-300 relative h-full w-full before:absolute before:top-[-5px] before:h-5 before:w-full before:rounded-t-lg ${
              selectedIndex !== 0 ? "" : ""
            }`
          }
        >
          <Tab.Panel className="h-full w-full" unmount={false}>
            <DragAndDropArea />
          </Tab.Panel>
          <Tab.Panel className="h-full w-full" unmount={false}>
            <Content>
              <URLInputArea />
            </Content>
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <Content>Content 3</Content>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="bg-base-300 flex flex-row justify-end gap-2 rounded-b-lg px-8 pb-4 pt-2">
        <Button variant="primary" className="border border-violet-300/50">
          Confirm
        </Button>
        <Button variant="error" className="border-error-600/50 border" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

function Content({ children }: PropsWithChildren) {
  return <div className="h-full w-full p-8">{children}</div>;
}

function DragAndDropArea() {
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

      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      setFile(files[0]);
      console.log(files);
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
  onChange?: (imageUrl: string) => void;
}

function URLInputArea() {
  const [url, setUrl] = useState<string>("");

  const handleRemoveUrl = () => {
    setUrl("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value.trim());
  };

  useEffect(() => {
    if (!navigator.clipboard) {
      return;
    }

    const checkClickboard = async () => {
      if (url.trim().length > 0) {
        return;
      }

      const text = await navigator.clipboard.readText();
      console.log({ text });
      setUrl(text.trim());
    };

    window.addEventListener("focus", checkClickboard);
    return () => {
      window.removeEventListener("focus", checkClickboard);
    };
  }, [url]);

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <div className="relative w-full">
        <input
          type="url"
          placeholder="Image URL..."
          value={url}
          onChange={handleUrlChange}
          className="h-10 w-full rounded-full py-2 pl-14 pr-5 shadow-md outline-none"
        />

        <span>
          <AiOutlineLink className="absolute top-2 left-4 text-2xl opacity-40" />
        </span>
      </div>

      <div className="m-4 h-full w-full rounded-lg border-2 border-dashed border-white p-2">
        {url && <ImagePreview url={url} name={url} onRemove={handleRemoveUrl} />}

        {!url && (
          <div className="flex h-full w-full cursor-pointer flex-row items-center justify-center gap-1 px-4 text-white">
            <MdHideImage className="text-4xl" />
            <span className="my-3 text-2xl">No image URL</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GenerateImageInputArea() {
  return <></>;
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
          onClick={handleRemove}
          className="text-base-600 absolute top-0 right-0 z-20 hover:text-red-300"
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

// TODO: Use regex, we only require an URL that is not relative
function checkIsValidURL(url: string): boolean {
  try {
    // This throw if is invalid or relative
    void new URL(url);
    return true;
  } catch {
    return false;
  }
}
