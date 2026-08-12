
import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../services/authService";
import "../style/auth.css";

function Signup() {
    document.title = "Eternal | Join Us"

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConf: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const { username, email, password, passwordConf } = formData;

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
            setSubmitting(true);
            await signUp(formData);
            navigate("/sign-in");

        } catch (err) {
            setError(err.response.data.message);
            setSubmitting(false);
        }
    }

    function isFormInvalid() {
        return !(
            username &&
            email &&
            password &&
            password === passwordConf
        );
    }

    return (
        <main className="signup-page">

            <div className="signup-card">

                <div className="signup-heading">
                    <p className="signup-eyebrow">
                        ETERNAL AUCTION HOUSE
                    </p>

                    <h1>Create Your Account</h1>

                    <p>
                        Join a world of rare and timeless pieces.
                    </p>
                </div>

                {error && (
                    <p className="signup-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="signup-form">

                    <div className="form-group">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            type="text"
                            id="username"
                            value={username}
                            name="username"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            value={email}
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
                            id="password"
                            value={password}
                            name="password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirm"
                            value={passwordConf}
                            name="passwordConf"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="signup-actions">

                        <button
                            type="submit"
                            disabled={isFormInvalid() || submitting}
                            className="signup-button"
                        >
                            {submitting ? "Signing up..." : "Create Account"}
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
                    Become part of Eternal
                </p>

            </div>

        </main>
    );
}

export default Signup;
