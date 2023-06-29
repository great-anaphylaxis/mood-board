// ye
import { NUM } from ".";
import { logout, createPost, redirect } from "./account";


// yeah, exactly what the function says
function convertDateToLocalDate(date) {
    // yeah
    return new Date(date).toLocaleString("en-US", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
}

// a function that return the "data" needed to "make" a nav button
function createNavButton(name, onclick = () => {}, isRighty = false) {
    // ye
    return {
        name: name,
        onclick: onclick,
        isRighty: isRighty
    }
}







// "handlers"
function createPostHandler(e, title, content) {
    // nope bruh
    e.preventDefault();

    createPost(title, content, res => {
        // check if response is bad
        if (res.status && res.status === NUM.FAILED) {
            return;
        }

        // return to feed
        redirect('/');
    });
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

    // if "righty"
    if (data.isRighty === true) {
        // return a "different" button
        return (
            <button className="nav-button nav-button-righty" onClick={data.onclick}>{data.name}</button>
        )
    }

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
            <NavButton data={createNavButton("Create Post", () => { redirect('/createpost') })} />
            <NavButton data={createNavButton("Log out", logout, true)} />
        </nav>
    );
}

// Content Component, where you put the posts, or something else
export const Content = function() {
    // the Content component
    return (
        <div id="content">
            
        </div>
    );
};

// CreatePost component, where you create posts
export const CreatePost = function() {

    // pretty self explanatory right?
    let title = "";
    let content = "";
    
    // le componente
    return (
        <>
            <h1>Create Post</h1>
            <form id="form" onSubmit={e => createPostHandler(e, title, content)}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" onChange={e => title = e.target.value}></input>
                <label htmlFor="content">Content</label>
                <textarea name="content" id="content" form="form" onChange={e => content = e.target.value}></textarea>
                <input type="submit" value="Submit"></input>
            </form>
        </>
    );
}