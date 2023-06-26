// import stuff that is essential
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Navbar, Content, Post } from './App';
import { servePageAccordingly, addPage } from './singlepage';
import { LoginForm } from './account';


addPage('/', <>
    <Navbar /><Content />
</>);

addPage('/login', <>
    <LoginForm />
</>);








// the root element 
const root = ReactDOM.createRoot(document.getElementById('root'));

// render "all" on the root element
root.render(
    servePageAccordingly(window.location.pathname)
);

// a function that renders the posts
export const renderContent = (content) => {
    // if content element does not exist
    if (document.getElementById('content') === null) {
        // end the function
        return;
    }

    // yeah it renders it
    ReactDOM.createRoot(document.getElementById('content')).render(
        <React.StrictMode>
            {content.map((post, i) => <Post key={i} data={post} />)}
        </React.StrictMode>
    );
};