import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

export default function UploadBox({ onClose, files, setFiles }) {
    const onDrop = (acceptedFiles) => {
        setFiles([...files,
        ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        )]
        );
        onClose()
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center cursor-pointer bg-white w-full flex flex-col items-center shadow-md"
            >
                <FiUpload className="text-gray-400 text-5xl mb-4" />
                <p className="text-gray-700 font-medium">Select files to upload</p>
                <p className="text-gray-500 text-sm">or drag & drop files here</p>
                <input {...getInputProps()} />
            </div>
        </div>
    );
}
