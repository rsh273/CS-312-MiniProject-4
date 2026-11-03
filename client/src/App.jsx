import { useEffect, useState } from "react";
import BlogPostForm from "./components/BlogPostForm";
import PostList from "./components/PostList";
import EditPost from "./components/EditPost";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./styles.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [page, setPage] = useState("home");

  useEffect(() => {
    loadPosts();
    loadUser();
  }, []);

  async function loadPosts() {
    const response = await fetch("/api/blogs");
    const data = await response.json();
    setPosts(data);
  }

  async function loadUser() {
    const response = await fetch("/api/user");
    const data = await response.json();
    setCurrentUser(data.user);
  }

  function handlePostCreated(post) {
    setPosts((currentPosts) => [
      post,
      ...currentPosts
    ]);
  }

  function handlePostUpdated(updatedPost) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === updatedPost.id
          ? updatedPost
          : post
      )
    );

    setEditingPost(null);

  }

  async function handleDelete(id) {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== id)
    );
  }

  async function handleSignOut () {
    await fetch("/api/signout", {
      method: "POST"
    });

    setCurrentUser(null);
    setEditingPost(null);
    setPage("home");
  }

  if (page === "signin") {
    return (
      <SignIn
        onSignIn={(user) => {
          setCurrentUser(user);
          setPage("home");
        }}
        onShowSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "signup") {
    return (
      <SignUp
        onShowSignin={() => setPage("signin")}
        />
    );
  }

  return (
    <>
      <header>
        <h1>My Blog</h1>
        <p>A place to share whatever is on your mind.</p>
        
        <div className="account-buttons">
          {currentUser ? (
            <>
              <span>
                Signed in as {currentUser.name}
                </span>
                
                <button onClick={handleSignOut}>
                  Sign Out
                </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("signin")}>
                Sign In
              </button>
              
              <button onClick={() => setPage("signup")}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>
      
      <main>
        {editingPost ? (
          <EditPost
            post={editingPost}
            onSave={handlePostUpdated}
            onCancel={() => setEditingPost(null)}
          />
        ) : currentUser ? (
          <BlogPostForm
            onPostCreated={handlePostCreated}
          />
        ) : (
          <section className="new-post">
            <h2>Create a Post</h2>
            <p>Sign in to create your own blog post.</p>

            <button onClick={() => setPage("signin")}>
              Sign In
            </button>
          </section>
        )}
        
        <PostList
          posts={posts}
          currentUser={currentUser}
          onEdit={setEditingPost}
          onDelete={handleDelete}
        />
      </main>
    </>
  );
}

export default App;