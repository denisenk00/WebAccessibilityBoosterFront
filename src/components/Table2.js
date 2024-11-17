import React from "react";

const Table2 = ({ entries }) => (
    <table className="table2">
        <thead>
        <tr>
            <th>Category</th>
            <th>Error Count</th>
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