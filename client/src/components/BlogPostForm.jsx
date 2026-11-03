import { useState } from "react";

function BlogPostForm({ onPostCreated }) {
    const [title, setTitle] = useState("");
    const [blog, setBlog] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch("/api/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                blog
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        setTitle("");
        setBlog("");

        onPostCreated(data);
    }

    return (
        <section className="new-post">
            <h2>Create a Post</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Post Title</label>

                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Give your post a title"
                    required
                />

                <label htmlFor="blog">Blog Post</label>
                <textarea
                    id="blog"
                    rows="7"
                    value={blog}
                    onChange={(event) => setBlog(event.target.value)}
                    placeholder="Write something..."
                    required
                />

                <button type="submit">
                    Post
                </button>
            </form>
        </section>
    );
}

export default BlogPostForm;