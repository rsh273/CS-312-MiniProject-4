import { useState } from "react";

function EditPost({ post, onSave, onCancel }) {
    const [title, setTitle] = useState(post.title);
    const [blog, setBlog] = useState(post.blog);

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch(`/api/blogs/${post.id}`, {
            method: "PUT",
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

        onSave(data);
    }

    return (
        <section className="edit-post">
            <h2>Edit Your Post</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="edit-title">
                    Post Title
                </label>

                <input
                    type="text"
                    id="edit-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />

                <label htmlFor="edit-blog">
                    Blog Post
                </label>

                <textarea
                    id="edit-blog"
                    rows="8"
                    value={blog}
                    onChange={(event) => setBlog(event.target.value)}
                    required
                />

                <div className="form-buttons">
                    <button type="submit">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
}

export default EditPost;