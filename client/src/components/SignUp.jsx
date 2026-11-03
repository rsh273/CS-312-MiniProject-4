import { useState } from "react";

function SignUp({ onShowSignin }) {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                name,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        onShowSignin();
    }

    return (
        <>
            <header>
                <h1>Create an Account</h1>
                <p>Sign up to create and manage your own blog posts.</p>
            </header>

            <main className="account-page">
                <section className="account-form">
                    <h2>Sign Up</h2>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="signup-user-id">
                            User ID
                        </label>

                        <input
                            type="text"
                            id="signup-user-id"
                            value={userId}
                            onChange={(event) =>
                                setUserId(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="signup-password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="signup-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <button type="submit">
                            Create Account
                        </button>

                    </form>

                    <p>
                        Already have an account?{" "}
                        <button
                            className="link-button"
                            onClick={onShowSignin}
                        >
                            Sign in
                        </button>
                    </p>
                </section>
            </main>
        </>
    );
}

export default SignUp;