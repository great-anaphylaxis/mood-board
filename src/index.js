// import stuff that is essential
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Navbar, Content } from './App.js';

// the root element 
const root = ReactDOM.createRoot(document.getElementById('root'));

// render "all" on the root element
root.render(
    <React.StrictMode>
        <Navbar />
        <Content />
    </React.StrictMode>
);