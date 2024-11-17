import React, { useState } from "react";
import FileDropZone from "./components/FileDropZone";
import HTMLViewer from "./components/HTMLViewer";
import Table1 from "./components/Table1";
import Table2 from "./components/Table2";
import LoadingSpinner from "./components/LoadingSpinner";
import {copyToClipboard, saveToFile} from "./Utility";
import "./App.css";

const App = () => {
  const [fileText, setFileText] = useState("");
  const [draggedFileName, setDraggedFileName] = useState("");
  const [table1Entries, setTable1Entries] = useState([]);
  const [table2Entries, setTable2Entries] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (html, fileName) => {
    setFileText(html);
    setDraggedFileName(fileName);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/ai/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      const data = await response.json();
      setTable1Entries(data.table1);
      setTable2Entries(data.table2);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app">
        <header>
          <h1>HTML Accessibility Processor</h1>
        </header>
        <FileDropZone onUpload={handleFileUpload} />
        {loading && <LoadingSpinner />}
        <HTMLViewer fileText={fileText} setFileText={setFileText} />
        <Table1
            entries={table1Entries}
            setEntries={setTable1Entries}
            fileText={fileText}
            setFileText={setFileText}
        />
        <Table2 entries={table2Entries} />
        <h4>Summary</h4>
        <p>{summary}</p>
        <button onClick={() => saveToFile(fileText, draggedFileName)}>Save to File</button>
        <button onClick={() => copyToClipboard(fileText)}>Copy</button>
      </div>
  );
};

export default App;