function PostList({ posts, currentUser, onEdit, onDelete}) {
    return (
        <section className="posts">
            <h2>Recent Posts</h2>

            {posts.length === 0 ? (
                <p className="empty-message">
                    No posts yet. Create the first one!
                </p>
            ) : (
                posts.map((post) => (
                    <article className="post" key={post.id}>
                        <h3>{post.title}</h3>

                        <p className="post-info">
                            By {post.name} •{" "}
                            {new Date(post.date).toLocaleString()}
                        </p>

                        <p className="post-content">
                            {post.blog}
                        </p>

                        {currentUser &&
                            currentUser.user_id === post.creator_user_id && (
                                <div className="post-buttons">
                                    <button
                                        className="edit-button"
                                        onClick={() => onEdit(post)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() => onDelete(post.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                    </article>
                ))
            )}
        </section>
    );
}

export default PostList;