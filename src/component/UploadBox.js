import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress, Button, message, Card } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

export default function UploadBox({ onClose, files, setFiles }) {
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = (acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => {
            if (file.type.startsWith("image/") && file.size > 5 * 1024 * 1024) {
                message.error(`${file.name} is too large (Max: 5MB for images)`);
                return false;
            }
            if (file.type.startsWith("video/") && file.size > 50 * 1024 * 1024) {
                message.error(`${file.name} is too large (Max: 50MB for videos)`);
                return false;
            }
            if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
                message.error(`${file.name} is not a valid image or video file`);
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

                {uploadProgress > 0 && <Progress percent={uploadProgress} className="mt-4 w-full" />}
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <Card title="Uploaded Files" className="mt-4 w-full shadow-md max-h-[300px] overflow-y-auto">
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div key={file.name} className="p-3 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-between">
                                <div className="flex flex-col w-60">
                                    <span className="truncate text-lg font-medium">{file.name}</span>
                                    <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                                </div>

                                {file.type.startsWith("image/") ? (
                                    <img src={file.preview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                                ) : (
                                    <video src={file.preview} controls className="w-16 h-16 object-cover rounded-lg" />
                                )}

                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFile(file)} />
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
