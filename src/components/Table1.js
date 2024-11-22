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
        } else alert("Елемент не знайдено")
    };

  // Обробка видалення елемента з таблиці
  const handleDelete = (index) => {
      // Create the filtered entries
      const updatedEntries = entries.filter((_, i) => i !== index);
      // Update the state with the filtered entries
      setEntries(updatedEntries);
      // Check if the updated entries are empty
      if (updatedEntries.length === 0) {
          alert("Всі помилки виправлено!");
      }
  };

    return (
        <table className="table1">
            <thead>
            <tr>
                <th>#</th>
                <th>XPath</th>
                <th>Рекомендований HTML тег</th>
                <th>Коментар</th>
                <th></th>
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
                        <div className="actions">
                            <button onClick={() => handleReplace(index, entry.xpath, entry.correctedHtmlTag)}>Застосувати</button>
                            <button onClick={() => handleDelete(index)}>Видалити</button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table1;