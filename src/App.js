// import React, { Component } from "react";
// import { Switch, Route, Link } from "react-router-dom";
 import "./App.css";
 import { styles } from "./css-common"
 import "highlight.js/styles/github.css"
 import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';


import React, { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Table, Button } from "reactstrap";
import Highlight from 'react-highlight';

const App = () => {
  const [fileText, setFileText] = useState("");
  const [table1Entries, setTable1Entries] = useState([]);
  const [table2Entries, setTable2Entries] = useState([]);
  const [summary, setSummary] = useState("");
  const [highlightedXPath, setHighlightedXPath] = useState(null);

  // Обробка drag-and-drop завантаження файлу
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      setFileText(text);

      // Відправлення файлу на бекенд
      try {
        console.log("Text = ", text)
        const response = await axios.post("http://localhost:8080/ai/analyse", { html: text });
        console.log("Response = ", response)
        const { table1, table2, summary } = response.data;
        setTable1Entries(table1);
        setTable2Entries(table2);
        setSummary(summary);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    reader.readAsText(file);
  };

  // Обробка заміни елемента
  const handleReplace = (index) => {
    const entry = table1Entries[index];
    const parser = new DOMParser();
    const doc = parser.parseFromString(fileText, "text/html");

    // Знаходимо елемент за XPath та замінюємо його HTML
    const element = doc.evaluate(entry.xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      element.outerHTML = entry.correctedHtmlTag;
      setFileText(doc.documentElement.outerHTML);

      // Видаляємо рядок із таблиці
      setTable1Entries(table1Entries.filter((_, i) => i !== index));
    }
  };

  // Обробка видалення елемента з таблиці
  const handleDelete = (index) => {
    setTable1Entries(table1Entries.filter((_, i) => i !== index));
  };

  // Підсвічування елементів у HTML
  const highlightElement = (xpath) => {
    console.log("highlightElement: ", xpath)
    setHighlightedXPath(xpath);
  }

  // Функція для збереження результату в файл
  const saveToFile = () => {
    const blob = new Blob([fileText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processed_file.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Функція для копіювання результату
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileText);
    alert("Copied to clipboard!");
  };

  return (
      <div className="container">
        <header>
          <h1>Web Accessibility Booster</h1>
        </header>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop HTML file here, or click to select file</p>
              </div>
          )}
        </Dropzone>

        {fileText && (
            <div>
              <h2>Uploaded File</h2>
                <Highlight className='html'>{fileText}</Highlight>

              <h3>Table 1 - Recommendations</h3>
              <Table bordered>
                <thead>
                <tr>
                  <th>#</th>
                  <th>XPath</th>
                  <th>Corrected HTML Tag</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {table1Entries.map((entry, index) => (
                    <tr
                        key={index}
                        onMouseEnter={() => highlightElement(entry.xpath)}
                        onMouseLeave={() => setHighlightedXPath(null)}
                    >
                      <td>{entry.id}</td>
                      <td>{entry.xpath}</td>
                      <td>{entry.correctedHtmlTag}</td>
                      <td>{entry.comment}</td>
                      <td>
                        <Button color="success" onClick={() => handleReplace(index)}>+</Button>{" "}
                        <Button color="danger" onClick={() => handleDelete(index)}>-</Button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>

              <h3>Table 2 - Error Counts by Category</h3>
              <Table bordered>
                <thead>
                <tr>
                  <th>Category</th>
                  <th>Error Count</th>
                </tr>
                </thead>
                <tbody>
                {table2Entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.category}</td>
                      <td>{entry.errorCount}</td>
                    </tr>
                ))}
                </tbody>
              </Table>

              <h4>Summary</h4>
              <p>{summary}</p>

              <Button  color="primary" onClick={saveToFile}>Save to File</Button>{" "}
              <Button color="secondary" onClick={copyToClipboard}>Copy to Clipboard</Button>
            </div>
        )}
      </div>
  );
};

export default withStyles(styles)(App);