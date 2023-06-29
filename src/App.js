// ye
import { logout } from "./account";

// yeah, exactly what the function says
function convertDateToLocalDate(date) {
    // yeah
    return new Date(date).toLocaleString("en-US", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
}

// a function that return the "data" needed to "make" a nav button
function createNavButton(name, onclick = () => {}) {
    // ye
    return {
        name: name,
        onclick: onclick
    }
}





// stuff, I guess you call it components

// Post Component
export const Post = function(props) {
    // the data variable
    let data = props.data;

    // the Post component itself
    return (
        <div className="post">
            <h1 className="title">{data.title}</h1>
            <h2 className="from">From: {data.from}</h2>
            <h2 className="date">Date: {convertDateToLocalDate(data.date)}</h2>
            <hr className="divider"></hr>
            <pre className="content">{data.content}</pre>
        </div>
    );
};

export const NavButton = function(props) {
    // the data
    let data = props.data;

    // the nav button
    return (
        <button className="nav-button" onClick={data.onclick}>{data.name}</button>
    );
}

// Navbar Component
export const Navbar = function() {
    // the Navbar component
    return (
        <nav className="nav">
            <NavButton data={createNavButton("Log out", logout)} />
        </nav>
    );
}

// Content Component, where you put the posts
export const Content = function() {
    // the Content component
    return (
        <div id="content">
            
        </div>
    );
};