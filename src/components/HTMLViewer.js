import React, {useEffect, useRef, useState} from "react";
import "../docco.css"
//import Highlight from 'react-highlight';

const HTMLViewer = ({ fileText, setFileText, xpath}) => {
    const contentRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Запобігає вставці нового рядка
            setFileText(contentRef.current.textContent); // Оновлюємо fileText при Enter
        }
    };

    const handleOnBlur = () => {
        setFileText(contentRef.current.textContent);
    }

    const highlightContent = (html, isBefore) => {
        console.log("highlightContent: ", html, isBefore)

        // const parser = new DOMParser();
        // const doc = parser.parseFromString(fileText, "text/html");
        // const element = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //const updated = '<span style="background: green">Some text</span>';
        if(window.getSelection()){
            const range = window.getSelection().getRangeAt(0);

            // Collapse the range to the insertion point
            range.collapse(isBefore);

            // Create a temporary div to hold the HTML and create a document fragment
            const el = document.createElement("pre");
            el.innerHTML = html;
            let frag = document.createDocumentFragment(), node, lastNode;

            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            console.log("range: ", range)
        } else if (document.selection && document.selection.createRange) {
            // IE < 9
            let range = document.selection.createRange();
            range.collapse(isBefore);
            range.pasteHTML(html);
        }

    }


        // Handle text replacement and cursor restoration
        const refreshInnerHtml = () => {
        console.log("refreshInnerHtml")
            const tagStart = '⇷';  // Start tag marker
            const tagEnd = '⇸';    // End tag marker
            const selection = window.getSelection();

            [].forEach.call(
                contentRef.current.querySelectorAll('[data-cpos]'),
                function(e) { e.remove() });

            // Insert the tags at the current cursor position
            highlightContent(tagStart, true);  // Insert before selection
            highlightContent(tagEnd, false);  // Insert after selection

            // Perform text replacement (wrap "ab" with a span)
            const updatedContent = contentRef.current.innerHTML.replace(/(ab)/g, '<span style="background-color: lightgreen">$1</span>');
            console.log("updatedContent: ", updatedContent)

            // Replace the markers with <span data-cpos> and restore the content
            const finalContent = updatedContent
                .replace(tagStart, '<span data-cpos>')
                .replace(tagEnd, '</span>');
            console.log("finalContent: ", finalContent)

            // Update the state with the modified content
            contentRef.current.innerHTML = finalContent;
            // Restore the cursor position to where the data-cpos span was inserted
            const editor = contentRef.current;
            console.log("editor: ", editor)
            const cursorElement = editor.querySelector('[data-cpos]');
            console.log("cursorElement: ", cursorElement)
            if (cursorElement) {
                const range = document.createRange();
                range.setStart(cursorElement, 0);
                range.setEnd(cursorElement, 0);
                console.log("range: ", range)
                selection.removeAllRanges();
                selection.addRange(range);
                console.log("selection: ", selection)
            }
            console.log("current html: ", contentRef.current.innerHTML)//екрановані символи
            const tempElement = document.createElement('div');
            tempElement.innerHTML = contentRef.current.innerHTML;
            const decodedHTML = tempElement.textContent || tempElement.innerText || '';
            console.log(decodedHTML);
            setFileText(decodedHTML); //зникають html tag
        };

    return (
       // <Highlight>
            <div
                ref={contentRef}
                contentEditable
                className="html-viewer"
                onKeyDown={handleKeyDown}
                //onKeyUp={refreshInnerHtml}
                onBlur={handleOnBlur}
                style={{ border: "1px solid black", padding: "10px", whiteSpace: "pre-wrap" }}
                //dangerouslySetInnerHTML={{ __html: fileText }} рендерить
            >
                {fileText}
            </div>
       // </Highlight>
    );
};

export default HTMLViewer;