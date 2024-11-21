export const saveToFile = (text, fileName) => {
    const blob = new Blob([text], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "processedAI_" + fileName;
    link.click();
};

 export const copyToClipboard = (fileText) => {
    navigator.clipboard.writeText(fileText);
    alert("Скопійовано в буфер!");
 };

