import React, { useRef } from "react";

const HTMLViewer = ({ fileText, setFileText }) => {
    const contentRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Запобігає вставці нового рядка
            setFileText(contentRef.current.textContent); // Оновлюємо fileText при Enter
        }
    };

    const handleOnBlur = (e) => {
        setFileText(contentRef.current.textContent);
    }

    return (
        <pre
            ref={contentRef}
            contentEditable
            className="html-viewer"
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
        >
      {fileText}
    </pre>
    );
};

export default HTMLViewer;