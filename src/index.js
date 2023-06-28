// import stuff that is essential
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Navbar, Content, Post } from './App';
import { servePageAccordingly, addPage } from './singlepage';
import { LoginForm, SignupForm, redirect } from './account';
import { getPosts, serverValidateCredentials } from './account';


// numbers
export const NUM = {
    FAILED: -1,
    SUCCESS: 1,

    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,
    MIN_PASSWORD_LENGTH: 5,
    MAX_PASSWORD_LENGTH: 32,
};



// pages
addPage('/', <>
    <Navbar /><Content />
</>);

addPage('/login', <>
    <LoginForm />
</>);

addPage('/signup', <>
    <SignupForm />
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

// on load window
window.addEventListener('load', () => {
    // validates the credentials when in main page
    if (window.location.pathname === '/') {
        // get posts when bro is good
        serverValidateCredentials(res => {
            // get posts
            getPosts();
        });

        // bro is bad ???
        // exile !!!
        redirect("/login");
    }
});