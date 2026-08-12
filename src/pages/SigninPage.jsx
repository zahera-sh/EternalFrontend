
import { useState } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../style/auth.css";

const SignInForm = () => {

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    function handleChange(event) {
        setError("");

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {

            const signedInUser = await signIn(formData);

            console.log(signedInUser);

            setUser(signedInUser);

            navigate("/dashboard");

        } catch (err) {

            console.log(`Error: ${err}`);

            setError(err?.response?.data?.message || "Unable to sign in.");
        }
    }

    return (
        <main className="signup-page">

            <div className="signup-card">

                <div className="signup-heading">

                    <p className="signup-eyebrow">
                        ETERNAL AUCTION HOUSE
                    </p>

                    <h1>Welcome Back</h1>

                    <p>
                        Continue your journey through timeless pieces.
                    </p>

                </div>

                {error && (
                    <p className="signup-error">
                        {error}
                    </p>
                )}

                <form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    className="signup-form"
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            autoComplete="off"
                            id="email"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            autoComplete="off"
                            id="password"
                            value={formData.password}
                            name="password"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="signup-actions">

                        <button
                            type="submit"
                            className="signup-button"
                        >
                            Sign In
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="cancel-button"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

                <div className="signup-divider">
                    <span>✦</span>
                </div>

                <p className="signup-footer">
                    Pieces Beyond Time.
                </p>

            </div>

        </main>
    );
};

export default SignInForm;
