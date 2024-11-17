import React from "react";
import Dropzone from "react-dropzone";

const FileDropZone = ({ onUpload }) => {
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => onUpload(e.target.result, file.name);
        reader.readAsText(file);
    };

    return (
        <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>Drag & drop HTML file here, or click to select file</p>
                </div>
            )}
        </Dropzone>
    );
};

export default FileDropZone;