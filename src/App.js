

let testData = {
    title: "HELP!",
    date: "1/12/2009 - 12:00AM",
    content: "I NEED HELP!"
};









// stuff, I guess you call it components

// Post Component
export const Post = function(props) {
    // the data variable
    let data = props.data;

    // the Post component itself
    return (
        <div className="post">
            <h1 className="title">{data.title}</h1>
            <h2 className="date">{data.date}</h2>
            <p className="content">{data.content}</p>
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
            <Post data={testData}/>
        </div>
    );
};