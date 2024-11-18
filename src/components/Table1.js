import React, {useEffect, useState} from "react";

const Table1 = ({ entries, setEntries, fileText, setFileText, setXpath}) => {

    const handleReplace = (index, xpath, correctedHtmlTag) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(fileText, "text/html");
        const element = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (element) {
            element.outerHTML = correctedHtmlTag;
            setFileText(doc.documentElement.outerHTML);
            // Видаляємо рядок з таблиці
            setEntries(entries.filter((_, i) => i !== index));
        }
    };

  // Обробка видалення елемента з таблиці
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

    return (
        <table className="table1">
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
            {entries.map((entry, index) => (
                <tr
                    key={index}
                    //onMouseEnter={() => setXpath(entry.xpath)}
                    onMouseLeave={() => {}}
                >
                    <td>{index + 1}</td>
                    <td>{entry.xpath}</td>
                    <td>{entry.correctedHtmlTag}</td>
                    <td>{entry.comment}</td>
                    <td>
                        <button onClick={() => handleReplace(index, entry.xpath, entry.correctedHtmlTag)}>Apply</button>
                        <button onClick={() => handleDelete(index)}>Refuse</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table1;