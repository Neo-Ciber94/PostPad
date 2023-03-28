import Dialog from "@/components/Dialog";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import Button from "./Button";
import { Tab } from "@headlessui/react";
import { GoCloudUpload } from "react-icons/go";
import { AiOutlineLink } from "react-icons/ai";
import { BsRobot } from "react-icons/bs";
import { FaCloudUploadAlt, FaImages } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

interface ImageInputDialogProps {
  onChange: (file: File) => void;
}

export default function ImageInputDialog() {
  const tabs = [
    { name: "From File", Icon: <GoCloudUpload /> },
    { name: "From URL", Icon: <AiOutlineLink /> },
    { name: "Generate", Icon: <BsRobot /> },
  ];

  return (
    <Dialog className="fixed top-10 flex h-[90%] w-[90%] flex-col overflow-hidden bg-base-500 md:w-[90%]">
      <Tab.Group>
        <Tab.List className="flex flex-row pt-10">
          {tabs.map((tab) => (
            <Tab
              className={({ selected }) =>
                `flex min-w-[150px] flex-row items-center justify-center gap-2 rounded-t-lg border-x border-t
                border-base-300/20 px-8 pb-2 pt-4 font-mono text-lg shadow-2xl outline-none transition duration-300 ${
                  selected ? "bg-base-300 " : "text-white hover:bg-base-600"
                }`
              }
              key={tab.name}
            >
              {tab.Icon} {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="h-full w-full bg-base-300">
          <Tab.Panel className="h-full w-full">
            <DragAndDropArea />
          </Tab.Panel>
          <Tab.Panel>
            <Content>Content 2</Content>
          </Tab.Panel>
          <Tab.Panel>
            <Content>Content 3</Content>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="flex flex-row justify-end gap-2 bg-base-300 px-8 pb-4 pt-2">
        <Button variant="primary" className="border border-violet-300/50">
          Confirm
        </Button>
        <Button variant="error" className="border border-error-600/50">
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
  const { getRootProps, getInputProps, isDragReject, isDragAccept, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop(files) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      console.log(files);
    },
  });

  const acceptedFile = useMemo(() => acceptedFiles[0], [acceptedFiles]);

  return (
    <div className="h-full w-full px-8 pb-4 pt-8">
      <div
        {...getRootProps()}
        className={`h-full w-full border-spacing-3 cursor-pointer rounded-xl border-4 border-dashed p-4
        transition duration-200 ${acceptedFile ? "" : "hover:bg-base-400/40"} ${
          isDragReject ? "bg-red-500/60" : ""
        } ${isDragAccept ? "bg-green-500/60" : ""}`}
      >
        <input {...getInputProps()} />
        {acceptedFile && previewUrl ? (
          <div className="flex flex-col items-center justify-center text-white">
            <img className="w-max-[400px] w-[50%] h-auto" src={previewUrl} alt={acceptedFile.name} />
            {acceptedFile.name}
          </div>
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

function URLInputArea() {
  return <></>;
}

function GenerateImageInputArea() {
  return <></>;
}
