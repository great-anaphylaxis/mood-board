import React from "react";

// where the pages are stored
let pages = {};

// default 404 page
pages["404"] = <pre>404, not found</pre>;

// a function to add a page
export const addPage = (path, html, isReactStrict = true) => {
    // if isReactStrict is true
    if (isReactStrict) {
        // cover it with the strict thingy
        pages[path] = <React.StrictMode>{html}</React.StrictMode>;
    }
    // else if isReactStrict is false
    else {
        // raw, what is specified is the one that is stored
        pages[path] = html;
    }
}

// a function which returns the page in which the specified path is supposed to serve (eh, what ?)
export const servePageAccordingly = (path) => {
    // if path actually has a corresponding page
    if (pages[path] !== undefined) {
        // return it
        return pages[path];
    }

    // if none
    else {
        // return a 404 page
        return pages["404"];

        // and yeah, there is a default 404 page to prevent an error hehe
    }
};