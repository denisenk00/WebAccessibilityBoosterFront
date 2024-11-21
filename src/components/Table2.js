import React from "react";

const Table2 = ({ entries }) => (
    <table className="table2">
        <thead>
        <tr>
            <th>Категорія</th>
            <th>Кількість помилок</th>
        </tr>
        </thead>
        <tbody>
        {entries.map((entry, index) => (
            <tr key={index}>
                <td>{entry.category}</td>
                <td>{entry.errorCount}</td>
            </tr>
        ))}
        </tbody>
    </table>
);

export default Table2;