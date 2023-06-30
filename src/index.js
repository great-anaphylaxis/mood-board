// import stuff that is essential
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { Navbar, Content, Post, CreatePost } from './feed';
import { servePageAccordingly, addPage } from './singlepage';
import { LoginForm, SignupForm, redirect, getPosts, serverValidateCredentials, isAPIRequestSuccessful } from './account';

// numbers
export const NUM = {
    FAILED: -1,
    SUCCESS: 1,

    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,

    MIN_PASSWORD_LENGTH: 5,
    MAX_PASSWORD_LENGTH: 32,

    MIN_POSTTITLE_LENGTH: 3,
    MAX_POSTTITLE_LENGTH: 64,

    MIN_POSTCONTENT_LENGTH: 3,
    MAX_POSTCONTENT_LENGTH: 10000,
};

// error messages
export const ERROR_MESSAGE = {
    UNKNOWN: "Something unknown happened!",

    INVALID_CREDENTIALS: "Invalid credentials",

    INVALID_USERNAME: "Invalid username",

    INVALID_PASSWORD: "Invalid password",

    INVALID_POSTTITLE: "Invalid post title",

    INVALID_POSTCONTENT: "Invalid post content",

    LOGIN_FAILED: "Login failed",

    SIGNUP_FAILED: "Signup failed",

    GETPOSTS_FAILED: "Getting posts failed",

    CREATEPOST_FAILED: "Create post failed",
};



// pages
addPage('/', <>
    <Navbar />
    <Content />
</>);

addPage('/login', <>
    <LoginForm />
</>);

addPage('/signup', <>
    <SignupForm />
</>);

addPage('/createpost', <>
    <Navbar />
    <CreatePost />
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

    // put emmm
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
        serverValidateCredentials(res => {
            // if it is good
            if (isAPIRequestSuccessful(res)) {
                // get posts
                getPosts(res => {
                    // render the post ssssssss
                    renderContent(res);
                });
            }

            // if bros not good
            else {
                // exile !!!
                redirect("/login");
            }
        });
    }
});