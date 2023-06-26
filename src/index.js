// import stuff that is essential
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Navbar, Content, Post } from './App.js';

// the root element 
const root = ReactDOM.createRoot(document.getElementById('root'));

// render "all" on the root element
root.render(
    <React.StrictMode>
        <Navbar />
        <Content />
    </React.StrictMode>
);

export const renderContent = (content) => {
    ReactDOM.createRoot(document.getElementById('content')).render(
        <React.StrictMode>
            {content.map((post, i) => <Post key={i} data={post} />)}
        </React.StrictMode>
    );
};