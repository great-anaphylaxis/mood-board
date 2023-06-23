





let testData = {
    title: "HELP!",
    date: "1/12/2009 - 12:00AM",
    content: "I NEED HELP!"
};

export const Post = function(props) {
    let data = props.data;

    return (
        <div className="post">
            <h1 className="title">{data.title}</h1>
            <h2 className="date">{data.date}</h2>
            <p className="content">{data.content}</p>
        </div>
    );
};

export const Content = function() {
    return (
        <div id="content">
            <Post data={testData}/>
        </div>
    );
};