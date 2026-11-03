import { useState } from "react";

function SignIn({ onSignIn, onShowSignup }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        onSignIn(data.user);
    }

    return (
        <>
            <header>
                <h1>Sign In</h1>
                <p>Sign in to create, edit, and delete your blog posts.</p>
            </header>
            
            <main className="account-page">
                <section className="account-form">
                    <h2>Welcome Back</h2>
                    
                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="user_id">
                            User ID
                        </label>
                        
                        <input
                            type="text"
                            id="user_id"
                            value={userId}
                            onChange={(event) =>
                                setUserId(event.target.value)
                            }
                            required
                        />
                        
                        <label htmlFor="password">
                            Password
                        </label>
                        
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                        
                        <button type="submit">
                            Sign In
                        </button>
                    </form>
                    
                    <p>
                        Don't have an account?{" "}
                        <button
                            className="link-button"
                            onClick={onShowSignup}
                        >
                            Sign Up
                        </button>
                    </p>
                </section>
            </main>
        </>
    );
}

export default SignIn;