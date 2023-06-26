import { renderContent } from ".";

let postDataArray = [];


function getPosts() {
    fetch("/api/getposts")
    .then(res => res.json())
    .then(res => postDataArray = res)
    .then(() => renderContent(postDataArray));
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
            <h2 className="date">Date: {new Date(data.date).toLocaleString("en-US", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})}</h2>
            <hr className="divider"></hr>
            <pre className="content">{data.content}</pre>
        </div>
    );
};

// Navbar Component
export const Navbar = function() {
    // the Navbar component
    return (
        <nav></nav>
    );
}

// Content Component, where you put the posts
export const Content = function() {
    // the Content component
    return (
        <div id="content">
            {postDataArray.map((post) => <Post data={post} />)}
        </div>
    );
};

getPosts();