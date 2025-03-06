import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress, Button, message, Card } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

export default function UploadBox({ onClose, files, setFiles }) {
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = (acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                message.error(`${file.name} is too large (Max: 5MB)`);
                return false;
            }
            if (!file.type.startsWith("image/")) {
                message.error(`${file.name} is not a valid image file`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setFiles([...files, ...validFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        )]);


        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 300);

        onClose();
    };


    const removeFile = (fileToRemove) => {
        setFiles(files.filter(file => file.name !== fileToRemove.name));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {/* Dropzone Box */}
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center cursor-pointer bg-white w-full flex flex-col items-center shadow-md"
            >
                <UploadOutlined className="text-gray-400 text-5xl mb-4" />
                <input {...getInputProps()} />
                <p className="text-gray-700 font-medium">Select files to upload</p>
                <p className="text-gray-500 text-sm">or drag & drop files here</p>

                {/* Upload Progress Bar */}
                {uploadProgress > 0 && <Progress percent={uploadProgress} className="mt-4 w-full" />}
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <Card title="Uploaded Files" className="mt-4 w-full shadow-md">
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div key={file.name} className="p-3 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-between">
                                <span className="truncate w-40">{file.name}</span>
                                <img src={file.preview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFile(file)} />
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
