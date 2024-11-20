import React, { useState } from "react";
import FileDropZone from "./components/FileDropZone";
import HTMLViewer from "./components/HTMLViewer";
import Table1 from "./components/Table1";
import Table2 from "./components/Table2";
import {copyToClipboard, saveToFile} from "./Utility";
import "./App.css";
import {PacmanLoader} from "react-spinners";

const App = () => {
  const [fileText, setFileText] = useState("");
    //const [innerHtml, setInnerHtml] = useState("");
  const [draggedFileName, setDraggedFileName] = useState("");
  const [xpath, setXpath] = useState("");
  const [table1Entries, setTable1Entries] = useState([]);
  const [table2Entries, setTable2Entries] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (html, fileName) => {
    setLoading(true);
    setFileText(html);
    //setInnerHtml(html)
    setDraggedFileName(fileName);
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
        {!fileText && (
            <>
              <FileDropZone onUpload={handleFileUpload} />
            </>
        )}
        {fileText && <HTMLViewer fileText={fileText} setFileText={setFileText} xpath={xpath} />}
        {loading && <div className="spinner-container"><h1 className="spinnerText">Аналізуємо</h1><PacmanLoader size={50}/></div>}
        {summary && (
            <>
              <Table1
                  entries={table1Entries}
                  setEntries={setTable1Entries}
                  fileText={fileText}
                  setFileText={setFileText}
                  setXpath={setXpath}
              />
              <Table2 entries={table2Entries} />
              <div className="summary">
                <h4>Summary</h4>
                <p>{summary}</p>
              </div>
              <div className="actions">
                <button onClick={() => saveToFile(fileText, draggedFileName)}>Save to File</button>
                <button onClick={() => copyToClipboard(fileText)}>Copy</button>
              </div>
            </>
        )}
      </div>
  );
};

export default App;